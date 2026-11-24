import { describe, it, expect, beforeEach } from 'vitest';
import { TestBed } from '@angular/core/testing';
import { OfferFiltersService } from './offer-filters.service';
import { OfferService } from './offer.service';
import { ProductService } from '@features/products/services/product.service';
import { Category } from '@core/types/category.interface';
import { ProductUI } from '@features/products/models/product-ui.interface';

const categories: Category[] = [
  {
    id: 'alimentos',
    name: 'Alimentos',
    href: '/category/alimentos',
    subcategories: [
      { name: 'Frutas y Verduras', href: '/category/alimentos/frutas-y-verduras' },
      { name: 'Bebidas', href: '/category/alimentos/bebidas' },
    ],
  },
  {
    id: 'tecnologia',
    name: 'Tecnología',
    href: '/category/tecnologia',
    subcategories: [{ name: 'Tablets', href: '/category/tecnologia/tablets' }],
  },
];

function buildOffer(id: string, categoria: string, discountPercentage: number): ProductUI {
  return {
    id,
    name: `Oferta ${id}`,
    url: `/product/${id}`,
    categoria,
    precio: 50,
    precioTexto: 'Precio: $50',
    imagen: '',
    oldPrice: 'RD$ 100',
    discountPercentage,
  };
}

// Espejo del contrato real de GET /offers: `categoria` es el slug de la
// categoría RAÍZ (ApiOffer.categoryId), nunca el de subcategoría.
const offers: ProductUI[] = [
  buildOffer('offer_alimentos_1', 'alimentos', 20),
  buildOffer('offer_alimentos_2', 'alimentos', 50),
  buildOffer('offer_tecnologia_1', 'tecnologia', 30),
];

describe('OfferFiltersService', () => {
  let service: OfferFiltersService;

  beforeEach(() => {
    TestBed.resetTestingModule();
    TestBed.configureTestingModule({
      providers: [
        OfferFiltersService,
        { provide: OfferService, useValue: { offers: () => offers } },
        { provide: ProductService, useValue: { categories: () => categories } },
      ],
    });
    service = TestBed.inject(OfferFiltersService);
  });

  it('devuelve todas las ofertas cuando la categoría es "all"', () => {
    expect(service.filteredProducts()).toEqual(offers);
    expect(service.sortedProducts()).toHaveLength(3);
  });

  it('filtra por categoría raíz comparando categoria directamente', () => {
    service.selectCategory('alimentos');

    const result = service.filteredProducts();
    expect(result.map(p => p.id)).toEqual(['offer_alimentos_1', 'offer_alimentos_2']);
    expect(result.every(p => p.categoria === 'alimentos')).toBe(true);
  });

  it('no incluye ofertas de otras categorías', () => {
    service.selectCategory('tecnologia');

    const result = service.filteredProducts();
    expect(result.map(p => p.id)).toEqual(['offer_tecnologia_1']);
    expect(result.some(p => p.categoria === 'alimentos')).toBe(false);
  });

  it('devuelve lista vacía para una categoría sin ofertas', () => {
    service.selectCategory('hogar');

    expect(service.filteredProducts()).toEqual([]);
  });

  it('ordena por discountPercentage de mayor a menor', () => {
    service.selectCategory('all');

    expect(service.sortedProducts().map(p => p.discountPercentage)).toEqual([50, 30, 20]);
  });
});
