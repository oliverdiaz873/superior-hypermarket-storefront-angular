import { describe, expect, it } from 'vitest';
import { toUiCartItem, uiCartFromServer, toMergePayload, discountFromPrices } from './cart-mapper';
import type { ApiCart, ApiCartItem } from '../types/cart-api.interface';
import type { CartItem } from '../types/cart.interface';

const apiItem = (overrides: Partial<ApiCartItem> = {}): ApiCartItem => ({
  productId: 'p1',
  name: 'Leche Deslactosada',
  price: 1125,
  unitPrice: 1125,
  originalPrice: 1500,
  discountPercentage: 25,
  isOffer: true,
  quantity: 2,
  image: 'leche.jpg',
  unit: 'litro',
  unitQuantity: 1,
  ...overrides,
});

describe('toUiCartItem', () => {
  it('maps the backend snapshot to the visual CartItem', () => {
    const ui = toUiCartItem(apiItem());

    expect(ui).toEqual({
      productId: 'p1',
      name: 'Leche Deslactosada',
      imagen: '/uploads/leche.jpg',
      unitPrice: 1125,
      unitLabel: 'litro',
      quantity: 2,
      oldPrice: '1500',
      isOffer: true,
      discountPercentage: 25,
      unitQuantity: 1,
    });
  });

  it('resuelve la key relativa del backend a ruta same-origen /uploads/', () => {
    const ui = toUiCartItem(apiItem({ image: 'products/bebidas/coca-cola.avif' }));
    expect(ui.imagen).toBe('/uploads/products/bebidas/coca-cola.avif');
  });

  it('mantiene las URLs absolutas tal cual', () => {
    const ui = toUiCartItem(apiItem({ image: 'https://cdn.example.com/a.webp?v=1' }));
    expect(ui.imagen).toBe('https://cdn.example.com/a.webp?v=1');
  });

  it('si unit está vacío / blanco → unitLabel undefined (estructurado; sin unidad = no definida)', () => {
    const ui = toUiCartItem(apiItem({ unit: '   ' }));
    expect(ui.unitLabel).toBeUndefined();
  });

  it('unit = undefined → unitLabel undefined', () => {
    const ui = toUiCartItem(apiItem({ unit: undefined }));
    expect(ui.unitLabel).toBeUndefined();
  });

  it('unit = null → unitLabel undefined (nullish safety)', () => {
    const ui = toUiCartItem(apiItem({ unit: null as unknown as undefined }));
    expect(ui.unitLabel).toBeUndefined();
  });

  it('leaves oldPrice undefined when there is no originalPrice', () => {
    const ui = toUiCartItem(apiItem({ originalPrice: undefined, isOffer: false }));
    expect(ui.oldPrice).toBeUndefined();
  });
});

describe('uiCartFromServer', () => {
  it('maps every item of the CartResponse', () => {
    const cart: ApiCart = {
      items: [apiItem({ productId: 'a' }), apiItem({ productId: 'b', unit: undefined })],
      totalItems: 4,
      subtotal: 4500,
    };

    expect(uiCartFromServer(cart).map((i) => i.productId)).toEqual(['a', 'b']);
    // unit undefined → NO unidad fantasma. Se guarda undefined.
    expect(uiCartFromServer(cart)[1].unitLabel).toBeUndefined();
  });

  it('returns an empty list for an empty server cart', () => {
    const cart: ApiCart = { items: [], totalItems: 0, subtotal: 0 };
    expect(uiCartFromServer(cart)).toEqual([]);
  });
});

describe('toMergePayload', () => {
  it('keeps only { productId, quantity } — local prices/offers are discarded', () => {
    const items: CartItem[] = [
      {
        productId: 'a',
        name: 'Arroz',
        imagen: 'arroz.jpg',
        unitPrice: 2200,
        unitLabel: 'kg',
        quantity: 3,
        oldPrice: '3000',
        isOffer: true,
        discountPercentage: 27,
      },
      { productId: 'b', name: 'Azúcar', imagen: 'azucar.jpg', unitPrice: 100, unitLabel: 'unidad', quantity: 1 },
    ];

    expect(toMergePayload(items)).toEqual([
      { productId: 'a', quantity: 3 },
      { productId: 'b', quantity: 1 },
    ]);
  });
});

describe('discountFromPrices', () => {
  it('computes the discount percentage from text oldPrice', () => {
    expect(discountFromPrices(1500, 'RD$ 2,000')).toBe(25);
  });

  it('returns 0 when there is no oldPrice', () => {
    expect(discountFromPrices(1500, undefined)).toBe(0);
  });

  it('returns 0 for non-positive parsing', () => {
    expect(discountFromPrices(1500, 'n/a')).toBe(0);
  });
});