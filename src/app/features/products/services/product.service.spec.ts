import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { HttpRequest } from '@angular/common/http';
import { ProductService } from './product.service';
import { getApiBaseUrl } from '@core/api/api.config';
import { ApiProduct } from '@core/api/api-types';
import { Category } from '@core/types/category.interface';
import { OfferService } from '@features/offers';

const apiCategory = {
  id: 'alimentos',
  name: 'Alimentos',
  slug: 'alimentos',
  subcategories: [{ name: 'Bebidas', slug: 'bebidas' }],
};

const category: Category = {
  id: 'alimentos',
  name: 'Alimentos',
  href: '/category/alimentos',
  subcategories: [{ name: 'Bebidas', href: '/category/alimentos/bebidas' }],
};

function buildProduct(id: string): ApiProduct {
  return {
    id,
    sku: `sku-${id}`,
    name: `Producto ${id}`,
    price: 100,
    image: null,
    categoryId: 'bebidas',
    category: { name: 'Bebidas', slug: 'bebidas' },
    status: 'active',
    isAvailable: true,
    createdAt: '2024-01-01T00:00:00.000Z',
    updatedAt: '2024-01-01T00:00:00.000Z',
  };
}

describe('ProductService (categories F5.3.1)', () => {
  let service: ProductService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [
        ProductService,
        { provide: OfferService, useValue: { offers: () => [] } },
      ],
    });
    service = TestBed.inject(ProductService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  describe('loadCategories', () => {
    it('mapea ApiCategory al modelo UI con slug como identidad', () => {
      service.loadCategories();

      const req = httpMock.expectOne(`${getApiBaseUrl()}/categories`);
      expect(req.request.method).toBe('GET');
      req.flush({ success: true, data: [apiCategory] });

      expect(service.categoriesLoaded()).toBe(true);
      expect(service.categories()).toEqual([category]);
    });

    it('no repite la peticiÃ³n una vez cargadas (cache)', () => {
      service.loadCategories();
      httpMock.expectOne(`${getApiBaseUrl()}/categories`).flush({ success: true, data: [apiCategory] });

      service.loadCategories();
      expect(service.categoriesLoaded()).toBe(true);
    });

    it('marca loading falso ante error y no rompe el flujo', () => {
      service.loadCategories();
      httpMock.expectOne(`${getApiBaseUrl()}/categories`).flush({ success: true, data: [] }, { status: 500, statusText: 'Error' });

      expect(service.categoriesLoading()).toBe(false);
      expect(service.categories()).toEqual([]);
    });
  });

  describe('loadCategorySections', () => {
    it('paginan todas las pÃ¡ginas: no asume que una sola respuesta contiene todo', () => {
      const page1 = Array.from({ length: 100 }, (_, i) => buildProduct(`p1-${i}`));
      const page2 = Array.from({ length: 50 }, (_, i) => buildProduct(`p2-${i}`));

      service.loadCategorySections(category);

      const productsUrl = (page: number) => (req: HttpRequest<unknown>) =>
        req.url === `${getApiBaseUrl()}/products` &&
        req.params.get('category') === 'bebidas' &&
        req.params.get('page') === String(page);

      const req1 = httpMock.expectOne(productsUrl(1));
      expect(req1.request.params.get('limit')).toBe('100');
      req1.flush({ success: true, data: page1, pagination: { page: 1, limit: 100, total: 150, pages: 2 } });

      const req2 = httpMock.expectOne(productsUrl(2));
      req2.flush({ success: true, data: page2, pagination: { page: 2, limit: 100, total: 150, pages: 2 } });

      const sections = service.categorySections()['alimentos'];
      expect(sections).toBeDefined();
      expect(sections[0].id).toBe('bebidas');
      expect(sections[0].name).toBe('Bebidas');
      expect(sections[0].products).toHaveLength(150);
      expect(service.categorySectionsLoading()).toBe(false);
    });

    it('carga una sola pÃ¡gina cuando la secciÃ³n cabe en el lÃ­mite', () => {
      const page1 = Array.from({ length: 3 }, (_, i) => buildProduct(`solo-${i}`));

      service.loadCategorySections(category);

      const req = httpMock.expectOne((r: HttpRequest<unknown>) => r.url === `${getApiBaseUrl()}/products` && r.params.get('page') === '1');
      req.flush({ success: true, data: page1, pagination: { page: 1, limit: 100, total: 3, pages: 1 } });

      expect(service.categorySections()['alimentos'][0].products).toHaveLength(3);
    });
  });

  describe('loadFeatured (E4.6)', () => {
    it('consume GET /products?featured=true sin IDs hardcodeados', () => {
      service.loadFeatured();

      const req = httpMock.expectOne(
        (r: HttpRequest<unknown>) =>
          r.url === `${getApiBaseUrl()}/products` && r.params.get('featured') === 'true'
      );
      expect(req.request.method).toBe('GET');

      const featuredProduct = buildProduct('destacado-1');
      req.flush({ success: true, data: [featuredProduct], pagination: { page: 1, limit: 100, total: 1, pages: 1 } });

      expect(service.featured()).toHaveLength(1);
      expect(service.featured()[0].id).toBe('destacado-1');
      expect(service.productsLoading()).toBe(false);
    });

    it('marca error y vacÃ­a featured cuando falla el request', () => {
      service.loadFeatured();

      const req = httpMock.expectOne(
        (r: HttpRequest<unknown>) =>
          r.url === `${getApiBaseUrl()}/products` && r.params.get('featured') === 'true'
      );
      req.flush({ success: false }, { status: 500, statusText: 'Error' });

      expect(service.featured()).toEqual([]);
      expect(service.error()).toBe('No se pudieron cargar los productos destacados.');
      expect(service.productsLoading()).toBe(false);
    });
  });
});
