import { ChangeDetectionStrategy, Component, computed, DestroyRef, inject, signal } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { TranslateService } from '@ngx-translate/core';
import { getCategoryName, getSubcategoryName } from '@core/utils';
import { subcategorySlugFromHref } from '@data/category-section-map.data';
import { SeoService } from '@core/services/seo.service';
import { BRAND_NAME } from '@core/constants';
import { ProductService } from '@features/products/services/product.service';
import { OfferService } from '@features/offers';
import { BreadcrumbComponent, BreadcrumbItem } from '@shared/components/breadcrumb/breadcrumb.component';
import { EmptyStateComponent } from '@shared/components/empty-state/empty-state.component';
import { ProductDetailSectionComponent } from '@features/products/components/product-detail-section/product-detail-section.component';
import { ProductCarouselSectionComponent } from '@features/products/components/product-carousel-section/product-carousel-section.component';
import { ProductDetailSkeletonComponent } from '@shared/components/skeleton/product-detail-skeleton.component';
import { ProductTranslationService } from '@features/products/services/product-translation.service';

@Component({
  selector: 'app-product-page',
  standalone: true,
  imports: [BreadcrumbComponent, EmptyStateComponent, ProductDetailSectionComponent, ProductCarouselSectionComponent, ProductDetailSkeletonComponent],
  template: `
    @if (productService.productDetailLoading()) {
      <app-product-detail-skeleton></app-product-detail-skeleton>
    } @else if (product()) {
      <app-breadcrumb variant="category" [items]="breadcrumbItems()"></app-breadcrumb>
      <div class="mx-auto max-w-[1280px] px-5">
        <app-product-detail-section [product]="product()!" [pageData]="pageData()"></app-product-detail-section>
      </div>
      <app-product-carousel-section title="Productos relacionados" [products]="related()" [sectionClass]="'mt-6 md:mt-8'" [id]="'productos-similares'" [idPrefix]="'similares'"></app-product-carousel-section>
    } @else {
      <app-empty-state title="Producto no encontrado" description="No encontramos el producto solicitado." actionLabel="Volver al inicio" actionHref="/"></app-empty-state>
    }
  `,
  styles: [`:host { display: block; }`],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ProductPageComponent {
  private readonly route = inject(ActivatedRoute);
  private readonly destroyRef = inject(DestroyRef);
  private readonly seo = inject(SeoService);
  private readonly translate = inject(TranslateService);
  private readonly productTranslation = inject(ProductTranslationService);
  protected readonly productService = inject(ProductService);
  private readonly offerService = inject(OfferService);
  private readonly langVersion = signal(0);
  readonly productId = signal('');

  readonly product = this.productService.detail;
  readonly related = this.productService.related;
  readonly pageData = computed(() => undefined);

  readonly breadcrumbItems = computed<BreadcrumbItem[]>(() => {
    this.langVersion();
    const product = this.product();
    const items: BreadcrumbItem[] = [
      { label: this.translate.instant('common.breadcrumb.home'), url: '/' },
    ];

    if (product) {
      const categories = this.productService.categories();
      const parent = categories.find(category =>
        category.subcategories.some(sub => subcategorySlugFromHref(sub.href) === product.categoria)
      );
      const subcategory = parent?.subcategories.find(sub => subcategorySlugFromHref(sub.href) === product.categoria);

      if (parent) {
        items.push({ label: getCategoryName(parent, this.translate), url: parent.href });
        if (subcategory) {
          items.push({ label: getSubcategoryName(subcategory, this.translate), url: subcategory.href });
        }
      } else {
        items.push({
          label: this.translate.instant(`categories.${product.categoria}`),
          url: `/category/${product.categoria}`,
        });
      }

      items.push({ label: this.productTranslation.getName(product) });
    }

    return items;
  });

  constructor() {
    this.offerService.loadAll();
    this.translate.onLangChange
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(() => {
        this.langVersion.update(v => v + 1);
        this.applyProductSeo();
      });

    this.route.paramMap.pipe(takeUntilDestroyed(this.destroyRef)).subscribe(params => {
      const id = params.get('id') ?? '';
      this.productId.set(id);
      this.productService.loadProductDetail(id);
      this.applyProductSeo();
    });
  }

  private applyProductSeo(): void {
    const product = this.product();
    const canonicalPath = `/product/${this.productId()}`;

    if (!product) {
      this.seo.applySeo({
        titleKey: 'common.product.not_found',
        description: this.translate.instant('common.product.not_found_description'),
        canonicalPath,
        jsonLd: null,
        robots: 'noindex, nofollow'
      });
      return;
    }

    const productName = this.productTranslation.getName(product);
    const description = this.productTranslation.getDescription(product, this.pageData());
    const imageUrl = this.seo.absoluteUrl(product.imagen);

    this.seo.applySeo({
      title: productName,
      description,
      canonicalPath,
      openGraph: {
        image: imageUrl,
        imageWidth: 1200,
        imageHeight: 630,
        type: 'website',
        url: this.seo.absoluteUrl(canonicalPath)
      },
      twitter: {
        card: 'summary_large_image',
        image: imageUrl
      },
      jsonLd: {
        '@context': 'https://schema.org',
        '@type': 'Product',
        name: productName,
        image: [imageUrl],
        description,
        sku: product.id,
        category: product.categoria,
        brand: {
          '@type': 'Brand',
          name: BRAND_NAME
        },
        offers: {
          '@type': 'Offer',
          priceCurrency: 'DOP',
          price: product.precio,
          itemCondition: 'https://schema.org/NewCondition',
          availability: 'https://schema.org/InStock',
          url: this.seo.absoluteUrl(canonicalPath)
        }
      }
    });
  }
}