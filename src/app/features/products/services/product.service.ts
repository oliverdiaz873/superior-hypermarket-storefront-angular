import { Injectable, inject, signal, computed } from '@angular/core';
import { Observable, forkJoin, of } from 'rxjs';
import { map, switchMap } from 'rxjs/operators';
import { ApiService } from '@core/api/api.service';
import { mapApiCategoriesToCategories } from '@core/api/category.mapper';
import type { Category } from '@core/types/category.interface';
export interface CategorySection {
  id: string;
  name: string;
  products: ProductUI[];
}
import { OfferService } from '@features/offers';
import { ProductUI } from '../models/product-ui.interface';
import { Product } from '@core/types/product.interface';
import { mapApiProductToProductUI, mapApiProductsToProductUI, toProductUI } from './product.mapper';

const subcategorySlugFromHref = (href: string): string => href.split('/').filter(Boolean).pop() ?? '';

/**
 * ProductService - orquesta productos de la API real (F5.2).
 *
 * Mantiene la superficie de signals que consumen Home/Category/ProductPage:
 * products, featured, detail, related, loading flags y error. El idioma
 * (`?lang=`) lo estampa el interceptor api-lang a partir de ngx-translate.
 *
 * F5.4: los productos se exponen ya enriquecidos con el badge de oferta real
 * (lookup de /offers vía OfferService). Los datasets crudos se guardan en
 * `*Raw` y los públicos son computed que reagregan el badge cuando llegan las
 * ofertas (única fuente de verdad: backend, sin fallback local).
 */
@Injectable({ providedIn: 'root' })
export class ProductService {
  private readonly api = inject(ApiService);
  private readonly offerService = inject(OfferService);

  private readonly _productsRaw = signal<ProductUI[]>([]);
  private readonly _featuredRaw = signal<ProductUI[]>([]);
  private readonly _detailRaw = signal<ProductUI | undefined>(undefined);
  private readonly _relatedRaw = signal<ProductUI[]>([]);
  private readonly _productsLoading = signal(false);
  private readonly _detailLoading = signal(false);
  private readonly _error = signal<string | null>(null);

  readonly products = computed(() => this.enrichWithOffers(this._productsRaw()));
  readonly featured = computed(() => this.enrichWithOffers(this._featuredRaw()));
  readonly detail = computed(() => this.enrichOne(this._detailRaw()));
  readonly related = computed(() => this.enrichWithOffers(this._relatedRaw()));
  readonly productsLoading = this._productsLoading.asReadonly();
  readonly productDetailLoading = this._detailLoading.asReadonly();
  readonly error = this._error.asReadonly();

  /**
   * F5.4: une los productos con el badge de oferta real (GET /offers) por id.
   * La oferta manda en el badge: los campos del backend reemplazan a los locales.
   */
  private offerMap(): Map<string, ProductUI> {
    const map = new Map<string, ProductUI>();
    for (const offer of this.offerService.offers()) map.set(offer.id, offer);
    return map;
  }

  private applyOffer(product: ProductUI, offers: Map<string, ProductUI>): ProductUI {
    const offer = offers.get(product.id);
    if (!offer) return product;
    return {
      ...product,
      oldPrice: offer.oldPrice,
      discountPercentage: offer.discountPercentage,
    };
  }

  private enrichWithOffers(products: ProductUI[]): ProductUI[] {
    const offers = this.offerMap();
    return products.map(product => this.applyOffer(product, offers));
  }

  private enrichOne(product: ProductUI | undefined): ProductUI | undefined {
    if (!product) return undefined;
    return this.applyOffer(product, this.offerMap());
  }

  /**
   * Carga una página de productos (GET /products). El limit por defecto es el del
   * backend; nunca se eleva MAX_LIMIT (decisión F5.0).
   */
  loadProducts(options: { page?: number; limit?: number; category?: string; categoryId?: string; subcategoryId?: string; q?: string } = {}): void {
    this._productsLoading.set(true);
    this._error.set(null);

    this.api.getProducts({
      page: options.page,
      limit: options.limit,
      category: options.category,
      categoryId: options.categoryId,
      subcategoryId: options.subcategoryId,
      q: options.q,
    }).subscribe({
      next: (collection) => {
        this._productsRaw.set(mapApiProductsToProductUI(collection.data).map(toProductUI));
        this._productsLoading.set(false);
      },
      error: () => {
        this._error.set('No se pudieron cargar los productos.');
        this._productsLoading.set(false);
      },
    });
  }

  /**
   * Carga los productos destacados desde la API real (E4.6):
   * GET /products?featured=true. El backend decide qué productos están
   * destacados (`featured`), sin IDs hardcodeados en el frontend.
   */
  loadFeatured(): void {
    this._productsLoading.set(true);
    this._error.set(null);

    this.api.getProducts({ featured: true, limit: 100 }).subscribe({
      next: (collection) => {
        this._featuredRaw.set(mapApiProductsToProductUI(collection.data).map(toProductUI));
        this._productsLoading.set(false);
      },
      error: () => {
        this._featuredRaw.set([]);
        this._error.set('No se pudieron cargar los productos destacados.');
        this._productsLoading.set(false);
      },
    });
  }

  /** Carga el detalle de un producto (GET /products/:id) y sus relacionados. */
  loadProductDetail(id: string): void {
    this._detailLoading.set(true);
    this._error.set(null);

    this.api.getProduct(id).subscribe({
      next: (envelope) => {
        const product = toProductUI(mapApiProductToProductUI(envelope.data));
        this._detailRaw.set(product);
        this._detailLoading.set(false);
        this.loadRelated(product);
      },
      error: () => {
        this._detailRaw.set(undefined);
        this._detailLoading.set(false);
      },
    });
  }

  /** Carga hasta 8 productos de la misma categoría (GET /products?category=slug). */
  private loadRelated(product: Product): void {
    this.api.getProducts({ category: product.categoria, limit: 50 }).subscribe({
      next: (collection) => {
        this._relatedRaw.set(
          mapApiProductsToProductUI(collection.data)
            .filter((p) => p.id !== product.id)
            .slice(0, 8)
            .map(toProductUI)
        );
      },
      error: () => this._relatedRaw.set([]),
    });
  }

  /** Categorías (GET /api/categories) mapeadas al modelo UI; y secciones de
   *  categoría cargadas desde la API con paginación (F5.3.1).
   */
  private readonly _categories = signal<Category[]>([]);
  private readonly _categoriesLoading = signal(false);
  private readonly _categoriesLoaded = signal(false);
  private readonly _categorySectionsRaw = signal<Record<string, CategorySection[]>>({});
  private readonly _categorySectionsLoading = signal(false);

  readonly categories = this._categories.asReadonly();
  readonly categoriesLoading = this._categoriesLoading.asReadonly();
  readonly categoriesLoaded = this._categoriesLoaded.asReadonly();

  /** Secciones de categoría con productos ya enriquecidos con el badge real (F5.4). */
  readonly categorySections = computed<Record<string, CategorySection[]>>(() => {
    const raw = this._categorySectionsRaw();
    const offers = this.offerMap();
    const out: Record<string, CategorySection[]> = {};
    for (const [key, sections] of Object.entries(raw)) {
      out[key] = sections.map(section => ({
        ...section,
        products: section.products.map(product => this.applyOffer(product, offers)),
      }));
    }
    return out;
  });
  readonly categorySectionsLoading = this._categorySectionsLoading.asReadonly();

  /** Carga las categorías una sola vez (cache). `slug` = identidad de navegación. */
  loadCategories(): void {
    if (this._categoriesLoaded()) return;
    this._categoriesLoading.set(true);

    this.api.getCategories().subscribe({
      next: (envelope) => {
        this._categories.set(mapApiCategoriesToCategories(envelope.data));
        this._categoriesLoaded.set(true);
        this._categoriesLoading.set(false);
      },
      error: () => {
        this._categoriesLoading.set(false);
      },
    });
  }

  /** Carga una sección por subcategoría respetando la paginación del backend:
   *  nunca asume que una sola respuesta contiene todos los productos (decisión
   *  F5.0; se pagen todas las páginas con el límite permitido).
   */
  private fetchAllProductsInCategory(categorySlug: string, subcategoryId?: string): Observable<ProductUI[]> {
    const LIMIT = 100;

    return this.api.getProducts({ category: categorySlug, subcategoryId, page: 1, limit: LIMIT }).pipe(
      switchMap((first) => {
        const total = first.pagination?.total ?? first.data.length;
        const pages = Math.max(1, Math.ceil(total / LIMIT));

        if (pages <= 1) {
          return of(first.data);
        }

        const remaining: Observable<typeof first>[] = [];
        for (let page = 2; page <= pages; page++) {
          remaining.push(this.api.getProducts({ category: categorySlug, subcategoryId, page, limit: LIMIT }));
        }

        return forkJoin(remaining).pipe(
          map((rest) => first.data.concat(...rest.map((collection) => collection.data)))
        );
      }),
      map((raw) => mapApiProductsToProductUI(raw).map(toProductUI))
    );
  }

  /** Construye las secciones (una por subcategoría) de una categoría desde la API. */
  loadCategorySections(category: Category): void {
    const categoryId = category.id;
    if (this._categorySectionsRaw()[categoryId]) return;
    this._categorySectionsLoading.set(true);

    const sections: CategorySection[] = [];
    const subs = category.subcategories.map((sub) => ({
      slug: subcategorySlugFromHref(sub.href),
      name: sub.name,
    }));

    if (subs.length === 0) {
      this._categorySectionsRaw.update((current) => ({ ...current, [categoryId]: sections }));
      this._categorySectionsLoading.set(false);
      return;
    }

    let pending = subs.length;
    subs.forEach((sub, index) => {
      this.fetchAllProductsInCategory(sub.slug).subscribe({
        next: (products) => {
          sections[index] = { id: sub.slug, name: sub.name, products };
          if (--pending === 0) {
            this._categorySectionsRaw.update((current) => ({ ...current, [categoryId]: sections }));
            this._categorySectionsLoading.set(false);
          }
        },
        error: () => {
          if (--pending === 0) {
            this._categorySectionsRaw.update((current) => ({ ...current, [categoryId]: sections }));
            this._categorySectionsLoading.set(false);
          }
        },
      });
    });
  }

  /**
   * Búsqueda real en el backend (GET /search). F5.3.2.
   * `q` nunca se envía vacío (guard local; el backend responde 400). El idioma
   * (`?lang=`) lo estampa el interceptor api-lang. No hay paginación en /search.
   */
  searchProducts(q: string, category?: string): Observable<ProductUI[]> {
    const trimmed = q.trim();
    if (!trimmed) {
      return of([]);
    }
    return this.api.search({ q: trimmed, category }).pipe(
      map((envelope) => mapApiProductsToProductUI(envelope.data).map(toProductUI))
    );
  }
}

