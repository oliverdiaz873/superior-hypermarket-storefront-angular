import { TestBed } from '@angular/core/testing';
import { signal, computed } from '@angular/core';
import { of, throwError } from 'rxjs';
import { CartService } from './cart.service';
import { CartApiService } from './cart-api.service';
import { AuthService } from '@features/auth/services/auth.service';
import type { AuthStatus } from '@features/auth/types/auth.interface';
import { Product } from '@core/types/product.interface';
import { CartItem } from '../types/cart.interface';
import type { ApiCart, ApiCartItem } from '../types/cart-api.interface';

/** Fake de AuthService con `status` tipo signal (A1) para controlar la sesión. */
class FakeAuthService {
  private _status = signal<AuthStatus>('loading');
  readonly status = this._status.asReadonly();
  readonly authenticated = computed(() => this._status() === 'authenticated');
  setStatus(status: AuthStatus): void {
    this._status.set(status);
  }
}

const mockProduct: Product = {
  id: 'prod-1',
  name: 'Leche Deslactosada',
  url: '/leche-deslactosada',
  categoria: 'lacteos',
  precio: 1500,
  precioTexto: 'Precio: $1.500 / litro',
  imagen: 'leche.jpg',
  unidad: 'litro'
};

const mockProduct2: Product = {
  id: 'prod-2',
  name: 'Arroz Integral',
  url: '/arroz-integral',
  categoria: 'despensa',
  precio: 2200,
  precioTexto: '$2.200 / kg.',
  imagen: 'arroz.jpg',
  unidad: 'kg'
};

const apiItem = (overrides: Partial<ApiCartItem> = {}): ApiCartItem => ({
  productId: 'prod-1',
  name: 'Leche Deslactosada',
  price: 1500,
  unitPrice: 1500,
  isOffer: false,
  quantity: 2,
  image: 'leche.jpg',
  unit: 'litro',
  ...overrides,
});

const apiCart = (items: ApiCartItem[]): ApiCart => ({
  items,
  totalItems: items.reduce((sum, i) => sum + i.quantity, 0),
  subtotal: items.reduce((sum, i) => sum + i.quantity * i.unitPrice, 0),
});

const settle = async (): Promise<void> => {
  // El pipeline (cola FIFO + firstValueFrom) resuelve en microtasks; drenar la
  // cadena de forma determinista sin depender de timers (evita flakiness bajo
  // carga del runner con workers paralelos).
  for (let i = 0; i < 25; i++) {
    await Promise.resolve();
  }
};

describe('CartService', () => {
  let service: CartService;
  let apiMock: {
    getCart: ReturnType<typeof vi.fn>;
    addItem: ReturnType<typeof vi.fn>;
    updateItem: ReturnType<typeof vi.fn>;
    removeItem: ReturnType<typeof vi.fn>;
    clearCart: ReturnType<typeof vi.fn>;
    mergeCart: ReturnType<typeof vi.fn>;
  };
  let authMock: FakeAuthService;

  beforeEach(() => {
    if (typeof window !== 'undefined') {
      window.localStorage.clear();
    }
    apiMock = {
      getCart: vi.fn(),
      addItem: vi.fn(),
      updateItem: vi.fn(),
      removeItem: vi.fn(),
      clearCart: vi.fn(),
      mergeCart: vi.fn(),
    };
    authMock = new FakeAuthService();

    TestBed.configureTestingModule({
      providers: [
        CartService,
        { provide: AuthService, useValue: authMock },
        { provide: CartApiService, useValue: apiMock },
      ],
    });

    service = TestBed.inject(CartService);
    // Sesión anónima por defecto: los flujos locales no tocan el backend.
    authMock.setStatus('anonymous');
    TestBed.flushEffects();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should start with an empty cart', () => {
    expect(service.items()).toEqual([]);
    expect(service.totalItems()).toBe(0);
    expect(service.totalPrice()).toBe(0);
  });

  it('should add a product to the cart', () => {
    service.addItem(mockProduct, 2);

    const items = service.items();
    expect(items.length).toBe(1);
    expect(items[0]).toEqual({
      productId: 'prod-1',
      name: 'Leche Deslactosada',
      imagen: 'leche.jpg',
      unitPrice: 1500,
      unitLabel: '2 litros',
      quantity: 2,
      precioTexto: 'Precio: $1.500 / litro',
      oldPrice: undefined,
      unidad: 'litro',
      isOffer: false,
      discountPercentage: 0,
      unitQuantity: 2
    });

    expect(service.totalItems()).toBe(2);
    expect(service.totalPrice()).toBe(3000);
  });

  it('should increment quantity if product already exists in cart', () => {
    service.addItem(mockProduct, 1);
    service.addItem(mockProduct, 2);

    expect(service.items().length).toBe(1);
    expect(service.items()[0].quantity).toBe(3);
    expect(service.totalItems()).toBe(3);
    expect(service.totalPrice()).toBe(4500);
  });

  it('should update item quantity by delta', () => {
    service.addItem(mockProduct, 1);
    service.updateQuantity('prod-1', 5);

    expect(service.items()[0].quantity).toBe(6);
    expect(service.totalItems()).toBe(6);
    expect(service.totalPrice()).toBe(9000);
  });

  it('should remove item if quantity drops to 0 or less after delta', () => {
    service.addItem(mockProduct, 2);
    service.updateQuantity('prod-1', -2);

    expect(service.items()).toEqual([]);
    expect(service.totalItems()).toBe(0);
  });

  it('should remove item completely', () => {
    service.addItem(mockProduct, 1);
    service.addItem(mockProduct2, 3);

    service.removeItem('prod-1');

    expect(service.items().length).toBe(1);
    expect(service.items()[0].productId).toBe('prod-2');
    expect(service.totalItems()).toBe(3);
    expect(service.totalPrice()).toBe(6600);
  });

  it('should clear the cart', () => {
    service.addItem(mockProduct, 2);
    service.addItem(mockProduct2, 1);

    service.clearCart();

    expect(service.items()).toEqual([]);
    expect(service.totalItems()).toBe(0);
    expect(service.totalPrice()).toBe(0);
  });

  it('should calculate discount percentage when oldPrice is provided', () => {
    service.addItem(mockProduct, 1, 'RD$ 2,000');

    const items = service.items();
    expect(items[0].isOffer).toBe(true);
    expect(items[0].discountPercentage).toBe(25);
    expect(items[0].oldPrice).toBe('RD$ 2,000');
  });

  it('should not mark as offer when oldPrice is equal to current price', () => {
    service.addItem(mockProduct, 1, 'RD$ 1,500');

    expect(service.items()[0].isOffer).toBe(false);
    expect(service.items()[0].discountPercentage).toBe(0);
  });

  it('should not mark product as offer when no discount applies', () => {
    service.addItem(mockProduct, 1);

    expect(service.items()[0].isOffer).toBe(false);
    expect(service.items()[0].discountPercentage).toBe(0);
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('should persist items to localStorage when cart changes', () => {
    const setItemSpy = vi.spyOn(Storage.prototype, 'setItem');

    service.addItem(mockProduct, 1);
    TestBed.flushEffects();

    const lastCall = setItemSpy.mock.calls.at(-1);
    expect(lastCall?.[0]).toBe('carrito');
    expect(lastCall?.[1]).toContain('"productId":"prod-1"');
  });

  it('should rehydrate and normalize legacy data from localStorage', () => {
    const legacyData = JSON.stringify([{
      productId: 'prod-1',
      name: 'Leche Deslactosada',
      imagen: 'leche.jpg',
      unitPrice: 1500,
      unitLabel: null,
      quantity: 2,
      precioTexto: 'Precio: $1.500 / litro'
    }, {
      productId: 'prod-2',
      name: 'Arroz Integral',
      imagen: 'arroz.jpg',
      unitPrice: 2200,
      unitLabel: null,
      quantity: 1,
      precioTexto: '$2.200 / kg.',
      oldPrice: 'RD$ 3,000'
    }, {
      productId: 'prod-3',
      name: 'Manzanas',
      imagen: 'manzanas.jpg',
      unitPrice: 45,
      unitLabel: 'lb',
      quantity: 1,
      precioTexto: '$45 / lb',
      oldPrice: 'RD$ 56.25',
      isOffer: false,
      discountPercentage: 0
    }]);

    const getItemSpy = vi.spyOn(Storage.prototype, 'getItem').mockReturnValue(legacyData);

    TestBed.resetTestingModule();
    TestBed.configureTestingModule({
      providers: [
        CartService,
        { provide: AuthService, useValue: authMock },
        { provide: CartApiService, useValue: apiMock },
      ],
    });
    const freshService = TestBed.inject(CartService);

    expect(freshService.items().length).toBe(3);
    // Normal product: no offer
    expect(freshService.items()[0].unitLabel).toBe('litro');
    expect(freshService.items()[0].isOffer).toBe(false);
    expect(freshService.items()[0].discountPercentage).toBe(0);
    expect(freshService.items()[0].unidad).toBeUndefined();
    // Product with oldPrice: discount derived from own data
    expect(freshService.items()[1].isOffer).toBe(true);
    expect(freshService.items()[1].discountPercentage).toBe(27);
    expect(freshService.items()[1].oldPrice).toBe('RD$ 3,000');
    // Legacy item with stale isOffer:false + oldPrice: must be corrected
    expect(freshService.items()[2].isOffer).toBe(true);
    expect(freshService.items()[2].discountPercentage).toBe(20);
    expect(freshService.items()[2].oldPrice).toBe('RD$ 56.25');
  });

  it('should compute totalPrice correctly with mixed items', () => {
    service.addItem(mockProduct, 2);
    service.addItem(mockProduct, 3, 'RD$ 2,000');

    expect(service.totalItems()).toBe(5);
    expect(service.totalPrice()).toBe(7500);
  });

  describe('anonymous (local cart)', () => {
    it('does not call the backend on any mutation', () => {
      service.addItem(mockProduct, 1);
      service.addItem(mockProduct, 1);
      service.updateQuantity('prod-1', -1);
      service.removeItem('prod-2');
      service.clearCart();

      expect(apiMock.addItem).not.toHaveBeenCalled();
      expect(apiMock.updateItem).not.toHaveBeenCalled();
      expect(apiMock.removeItem).not.toHaveBeenCalled();
      expect(apiMock.clearCart).not.toHaveBeenCalled();
    });
  });

  describe('authenticated (server cart)', () => {
    /** Autentica y deja el carrito sincronizado con el servidor. */
    const syncAs = async (cart: ApiCart) => {
      authMock.setStatus('anonymous');
      TestBed.flushEffects();
      apiMock.getCart.mockReturnValue(of(cart));
      authMock.setStatus('authenticated');
      TestBed.flushEffects();
      await settle();
      await settle();
    };

    it('syncs the server cart on login when there are no local items', async () => {
      const server = apiCart([apiItem({ quantity: 3 })]);
      apiMock.getCart.mockReturnValue(of(server));

      authMock.setStatus('authenticated');
      TestBed.flushEffects();
      await settle();
      await settle();

      expect(apiMock.getCart).toHaveBeenCalledTimes(1);
      expect(service.items().length).toBe(1);
      expect(service.items()[0].quantity).toBe(3);
      expect(service.items()[0].unitPrice).toBe(1500);
      expect(service.items()[0].unitLabel).toBe('litro');
    });

    it('merges the local guest cart into server via a single POST /merge (server-wins)', async () => {
      service.addItem(mockProduct, 2);
      apiMock.mergeCart.mockReturnValue(
        of(apiCart([apiItem({ quantity: 5, unitPrice: 1800, price: 1800 })])),
      );

      authMock.setStatus('anonymous');
      TestBed.flushEffects();
      authMock.setStatus('authenticated');
      TestBed.flushEffects();
      await settle();
      await settle();

      expect(apiMock.mergeCart).toHaveBeenCalledTimes(1);
      expect(apiMock.mergeCart).toHaveBeenCalledWith([{ productId: 'prod-1', quantity: 2 }]);
      // Server-wins: cantidades y precios vienen del snapshot, no del local.
      expect(service.items()[0].quantity).toBe(5);
      expect(service.items()[0].unitPrice).toBe(1800);
      // El espejo local se limpia tras el merge exitoso.
      expect(window.localStorage.getItem('carrito')).toBeNull();
    });

    it('keeps the local cart and marks pendingMerge when /merge fails', async () => {
      service.addItem(mockProduct, 1);
      apiMock.mergeCart.mockReturnValue(throwError(() => new Error('offline')));

      authMock.setStatus('anonymous');
      TestBed.flushEffects();
      authMock.setStatus('authenticated');
      TestBed.flushEffects();
      await settle();
      await settle();

      expect(apiMock.mergeCart).toHaveBeenCalledTimes(1);
      // Fallback offline: se conserva el carrito local.
      expect(service.items().length).toBe(1);

      // En pendingMerge las mutaciones siguen siendo locales.
      service.addItem(mockProduct, 1);
      expect(service.items()[0].quantity).toBe(2);
      expect(apiMock.addItem).not.toHaveBeenCalled();
      expect(window.localStorage.getItem('carrito')).not.toBeNull();
    });

    it('retries a pending merge when the connection is restored (online)', async () => {
      service.addItem(mockProduct, 1);
      apiMock.mergeCart.mockReturnValue(throwError(() => new Error('offline')));

      authMock.setStatus('anonymous');
      TestBed.flushEffects();
      authMock.setStatus('authenticated');
      TestBed.flushEffects();
      await settle();
      await settle();
      expect(service.items().length).toBe(1);

      apiMock.mergeCart.mockReturnValue(of(apiCart([apiItem({ quantity: 5 })])));
      window.dispatchEvent(new Event('online'));
      await settle();
      await settle();

      expect(apiMock.mergeCart).toHaveBeenCalledTimes(2);
      expect(service.items()[0].quantity).toBe(5);
      expect(window.localStorage.getItem('carrito')).toBeNull();
    });

    it('applies an authenticated addItem optimistically and reconciles with the server', async () => {
      await syncAs(apiCart([apiItem({ quantity: 2 })]));

      apiMock.updateItem.mockReturnValue(of(apiCart([apiItem({ quantity: 3 })])));
      service.addItem(mockProduct, 1);

      // Optimista inmediato: 2 + 1.
      expect(service.items()[0].quantity).toBe(3);

      await settle();
      expect(apiMock.updateItem).toHaveBeenCalledWith('prod-1', 3);
      expect(service.items()[0].quantity).toBe(3);
    });

    it('uses POST /items for a product not yet on server, then switches to PATCH absolute', async () => {
      await syncAs(apiCart([]));

      const prod2 = (quantity: number) =>
        apiItem({ productId: 'prod-2', name: 'Arroz Integral', image: 'arroz.jpg', unitPrice: 2200, price: 2200, unit: 'kg', quantity });
      apiMock.addItem.mockReturnValue(of(apiCart([prod2(1)])));
      apiMock.updateItem.mockReturnValue(of(apiCart([prod2(2)])));

      service.addItem(mockProduct2, 1);
      service.addItem(mockProduct2, 1);
      await settle();
      await settle();

      // Serialización A→B: primero POST /items, luego PATCH con cantidad absoluta.
      expect(apiMock.addItem).toHaveBeenCalledTimes(1);
      expect(apiMock.addItem).toHaveBeenCalledWith('prod-2', 1);
      expect(apiMock.updateItem).toHaveBeenCalledTimes(1);
      expect(apiMock.updateItem).toHaveBeenCalledWith('prod-2', 2);
      expect(service.items()[0].quantity).toBe(2);
    });

    it('deletes the item server-side when quantity drops to zero', async () => {
      await syncAs(apiCart([apiItem({ quantity: 1 })]));

      apiMock.removeItem.mockReturnValue(of(apiCart([])));
      service.updateQuantity('prod-1', -1);

      expect(service.items()).toEqual([]);

      await settle();
      expect(apiMock.removeItem).toHaveBeenCalledWith('prod-1');
    });

    it('rolls back to the last confirmed CartResponse when a mutation fails', async () => {
      await syncAs(apiCart([apiItem({ quantity: 2 })]));

      apiMock.updateItem.mockReturnValue(throwError(() => new Error('boom')));
      service.addItem(mockProduct, 1);
      expect(service.items()[0].quantity).toBe(3);

      await settle();
      await settle();

      expect(service.items()[0].quantity).toBe(2);
    });

    it('calls DELETE /api/cart when clearing an authenticated cart', async () => {
      await syncAs(apiCart([apiItem({ quantity: 1 })]));

      apiMock.clearCart.mockReturnValue(of(apiCart([])));
      service.clearCart();

      expect(service.items()).toEqual([]);

      await settle();
      expect(apiMock.clearCart).toHaveBeenCalledTimes(1);
    });

    it('clears the local mirror on logout keeping the server cart intact', async () => {
      await syncAs(apiCart([apiItem({ quantity: 2 })]));
      apiMock.updateItem.mockReturnValue(of(apiCart([apiItem({ quantity: 3 })])));
      service.addItem(mockProduct, 1);
      await settle();

      authMock.setStatus('anonymous');
      TestBed.flushEffects();
      await settle();

      expect(service.items()).toEqual([]);
      // El espejo local queda sin items: o se eliminó la clave o quedó vacío []
      // (el effect de persistencia en modo anónimo puede escribir el carrito vacío).
      const stored = window.localStorage.getItem('carrito');
      expect(stored === null || stored === '[]').toBe(true);
      // Logout es client-side: no se llama a DELETE /api/cart.
      expect(apiMock.clearCart).not.toHaveBeenCalled();
    });
  });
});