import { Injectable, signal, computed, effect, inject } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { Observable, firstValueFrom, fromEvent, throwError } from 'rxjs';
import { Product } from '@core/types/product.interface';
import { CartItem, CartMode } from '../types/cart.interface';
import type { StructuredUnitInput } from '@core/utils/price-utils';
import { ApiCart } from '../types/cart-api.interface';
import { discountFromPrices, toMergePayload, uiCartFromServer } from '../utils/cart-mapper';
import { createSerialQueue } from '../utils/mutation-queue';
import { ProductUI } from '@features/products/models/product-ui.interface';
import { StorageService } from '@core/services/storage.service';
import { PlatformService } from '@core/services/platform.service';
import { AuthService } from '@features/auth/services/auth.service';
import type { AuthStatus } from '@features/auth/types/auth.interface';
import { CartApiService } from './cart-api.service';

/**
 * Estado global del carrito (A2 — migración carrito local → server).
 *
 * API pública PRESERVADA: `items`, `totalItems`, `totalPrice`, `addItem`,
 * `removeItem`, `updateQuantity`, `clearCart` y el tipo `CartItem`.
 *
 * Comportamiento A2 (paridad funcional con N2 CartContext):
 *  - Anónimo: igual que antes (localStorage['carrito'] + cálculos locales).
 *  - Autenticado: el servidor (`/api/cart`) es la fuente de verdad de
 *    cantidades, precios, ofertas y snapshot. El cliente solo transforma el
 *    `CartResponse` (cart-mapper) al modelo visual; jamás recalcula el precio.
 *  - Login/Registro → merge automático guest→server vía UNA llamada a
 *    `POST /api/cart/merge` (server-wins).
 *  - `pendingMerge`: si el merge falla (backend caído/offline) se conserva el
 *    carrito local y se reintenta al recuperar la conexión (`online`).
 *  - Mutaciones de cantidades serializadas por una cola FIFO (A→B→C), con
 *    update optimista y rollback al último CartResponse confirmado.
 *  - Logout: limpia el espejo local (localStorage) conservando el carrito
 *    server-side.
 *  - La cookie httpOnly la gestiona el interceptor `authInterceptor`; el
 *    cliente nunca toca el JWT.
 */
@Injectable({
  providedIn: 'root'
})
export class CartService {
  private readonly STORAGE_KEY = 'carrito';

  private readonly storage = inject(StorageService);
  private readonly platform = inject(PlatformService);
  private readonly api = inject(CartApiService);
  private readonly auth = inject(AuthService);

  private readonly _cartItems = signal<CartItem[]>([]);
  private readonly _mode = signal<CartMode>('loading');
  private readonly _pendingMerge = signal<boolean>(false);
  private readonly _serverSynced = signal<boolean>(false);

  /** Último CartResponse confirmado por el backend (autoritativo para rollback). */
  private _serverCart: ApiCart | null = null;
  /** Espejo local/anónimo (origen del merge; se limpia tras merge exitoso o logout). */
  private _localCart: CartItem[] = [];
  /** El carrito local de esta sesión ya fue mergeado. */
  private _mergedThisSession = false;
  private _mergeInFlight = false;
  private _prevAuthStatus: AuthStatus = 'loading';

  private readonly _queue = createSerialQueue();

  /** Public read-only signal for cart items */
  public readonly items = this._cartItems.asReadonly();

  /** Total number of items across all cart entries */
  public readonly totalItems = computed(() =>
    this._cartItems().reduce((sum, item) => sum + item.quantity, 0)
  );

  /** Total price computed from unitPrice * quantity */
  public readonly totalPrice = computed(() =>
    this._cartItems().reduce((sum, item) => sum + (item.quantity * item.unitPrice), 0)
  );

  constructor() {
    this.rehydrate();

    // Persistir el espejo local SOLO en modo local (anónimo/pendingMerge).
    effect(() => {
      if (this._mode() === 'loading') return;
      const isServerSource =
        this._mode() === 'authenticated' && !this._pendingMerge() && this._serverSynced();
      if (isServerSource) return;
      this.storage.set<CartItem[]>(this.STORAGE_KEY, this._cartItems());
    });

    // Reaccionar a la sesión: loading → anonymous | authenticated; logout.
    effect(() => this.onSessionChange(this.auth.status()));

    // Reintentar un merge pendiente al recuperar la conexión (solo navegador).
    if (this.platform.isBrowser()) {
      fromEvent(window, 'online')
        .pipe(takeUntilDestroyed())
        .subscribe(() => {
          if (this._mode() === 'authenticated' && this._pendingMerge()) {
            void this.tryMerge();
          }
        });
    }
  }

  /**
   * Adds a product to the cart. If it already exists, increments the quantity.
   * When oldPrice is provided, calculates discount percentage and marks the
   * item as an offer. The discount data becomes part of the CartItem and
   * does not depend on any external lookup at rehydration time.
   * Autenticado: update optimista + mutación serializada contra `/api/cart`.
   */
  public addItem(product: Product, quantity = 1, oldPrice?: string): void {
    if (quantity <= 0) return;

    const alreadyInCart = this._cartItems().some((item) => item.productId === product.id);
    if (alreadyInCart) {
      this.optimisticUpdate(product.id, quantity);
    } else {
      this.optimisticAdd(product, quantity, oldPrice);
    }

    if (this._mode() === 'anonymous' || this._pendingMerge()) return;

    this.enqueueServerOp(() => {
      const serverItem = this._serverCart?.items.find((i) => i.productId === product.id);
      return serverItem
        ? this.api.updateItem(product.id, serverItem.quantity + quantity)
        : this.api.addItem(product.id, quantity);
    });
  }

  /** Removes an item completely from the cart by product ID */
  public removeItem(productId: string): void {
    this.optimisticRemove(productId);

    if (this._mode() !== 'anonymous' && !this._pendingMerge()) {
      this.enqueueServerOp(() => this.api.removeItem(productId));
    }
  }

  /**
   * Updates the quantity of a specific item by applying a delta.
   * If the resulting quantity is 0 or less, the item is removed.
   */
  public updateQuantity(productId: string, delta: number): void {
    this.optimisticUpdate(productId, delta);

    if (this._mode() === 'anonymous' || this._pendingMerge()) return;

    this.enqueueServerOp(() => {
      const serverItem = this._serverCart?.items.find((i) => i.productId === productId);
      const cartItem = this._cartItems().find((i) => i.productId === productId);
      if (serverItem) {
        const next = serverItem.quantity + delta;
        return next <= 0 ? this.api.removeItem(productId) : this.api.updateItem(productId, next);
      }
      if (cartItem) {
        // Item aún no confirmado en server: POST /items incrementa server-side.
        return this.api.addItem(productId, Math.max(1, cartItem.quantity));
      }
      return throwError(() => new Error('Cart item not found'));
    });
  }

  /** Empties the entire cart (server-side cuando hay sesión). */
  public clearCart(): void {
    this.optimisticClear();

    if (this._mode() !== 'anonymous' && !this._pendingMerge()) {
      this.enqueueServerOp(() => this.api.clearCart());
    }
  }

  /**
   * Cambio de estado de sesión. En Angular se observan las signals de
   * `AuthService` (A1) mediante un `effect` que despacha la transición.
   */
  private onSessionChange(status: AuthStatus): void {
    const prev = this._prevAuthStatus;
    this._prevAuthStatus = status;
    if (status === 'loading' || status === prev) return;

    if (status === 'authenticated') {
      this._mode.set('authenticated');
      this._serverSynced.set(false);
      void this.resolveSession();
    } else if (prev === 'authenticated') {
      // Logout: el espejo local se limpia; el carrito server permanece server-side.
      this.logoutLocal();
    } else {
      this._mode.set('anonymous');
    }
  }

  private logoutLocal(): void {
    this._mode.set('anonymous');
    this._cartItems.set([]);
    this._localCart = [];
    this._serverCart = null;
    this._pendingMerge.set(false);
    this._serverSynced.set(false);
    this._mergedThisSession = false;
    this.storage.remove(this.STORAGE_KEY);
  }

  /**
   * Al entrar autenticado: si hay carrito local → merge server-wins (UNA
   * llamada a POST /api/cart/merge); si no, sincronizar el carrito server.
   */
  private async resolveSession(): Promise<void> {
    if (this._mode() !== 'authenticated' || this._serverSynced()) return;
    if (this._pendingMerge() || this._mergeInFlight) return;

    this._mergeInFlight = true;
    try {
      if (this._localCart.length > 0) {
        await this.tryMerge();
      } else {
        await this.syncServerCart();
      }
    } finally {
      this._mergeInFlight = false;
    }
  }

  private async syncServerCart(): Promise<void> {
    try {
      const cart = await firstValueFrom(this.api.getCart());
      this._serverCart = cart;
      this._serverSynced.set(true);
      this._cartItems.set(uiCartFromServer(cart));
    } catch {
      // Autenticado pero backend no disponible → fallback anónimo/local.
      this._mode.set('anonymous');
    }
  }

  private async tryMerge(): Promise<void> {
    const payload = toMergePayload(this._localCart);
    try {
      const cart = await firstValueFrom(this.api.mergeCart(payload));
      this._serverCart = cart;
      this.storage.remove(this.STORAGE_KEY);
      this._localCart = [];
      this._pendingMerge.set(false);
      this._serverSynced.set(true);
      this._mergedThisSession = true;
      this._mode.set('authenticated');
      this._cartItems.set(uiCartFromServer(cart));
    } catch {
      // Backend caído/offline → fallback offline; se conserva el carrito local.
      this._pendingMerge.set(true);
      this._cartItems.set([...this._localCart]);
    }
  }

  /**
   * Ejecuta una mutación autenticada mediante la cola serializada: optimista
   * + reconciliación con el CartResponse o rollback al último confirmado.
   */
  private enqueueServerOp(op: () => Observable<ApiCart>): void {
    void this._queue.push(async () => {
      try {
        const cart = await firstValueFrom(op());
        this._serverCart = cart;
        this._serverSynced.set(true);
        this._cartItems.set(uiCartFromServer(cart));
      } catch {
        if (this._serverCart) {
          this._cartItems.set(uiCartFromServer(this._serverCart));
          this._serverSynced.set(true);
        }
      }
    });
  }

  private optimisticAdd(product: Product, quantity: number, oldPrice?: string): void {
    this._cartItems.update((items) => [...items, this.buildCartItem(product, quantity, oldPrice)]);
    this.pushMirror();
  }

  private optimisticUpdate(productId: string, delta: number): void {
    this._cartItems.update((items) =>
      items
        .map((item) =>
          item.productId === productId ? { ...item, quantity: item.quantity + delta } : item
        )
        .filter((item) => item.quantity > 0)
    );
    this.pushMirror();
  }

  private optimisticRemove(productId: string): void {
    this._cartItems.update((items) => items.filter((item) => item.productId !== productId));
    this.pushMirror();
  }

  private optimisticClear(): void {
    this._cartItems.set([]);
    this.pushMirror();
  }

  /** Refleja la vista actual en el espejo local cuando corresponde. */
  private pushMirror(): void {
    if (this._mode() === 'anonymous' || this._pendingMerge()) {
      this._localCart = [...this._cartItems()];
    }
  }

  /** Construye el item visual para el update optimista (usa los datos locales). */
  private buildCartItem(product: Product, quantity: number, oldPrice?: string): CartItem {
    // --- Datos estructurados (NUEVO patrón).
    // unitLabel = NOMBRE DE LA UNIDAD (sin plural, sin cantidad).
    // unitQuantity = CANTIDAD de esa unidad por presentación (1, 2, 0.5, 500, …).
    // La presentación ("2 litros", "0.5 kg") la calcula la UI a través
    // de formatUnitLabel con el TranslateService actual (i18n).
    const finalUnidad = this.extractUnidadName(product);
    const structured = product as unknown as StructuredUnitInput;
    const productQuantity = structured.quantity ?? structured.unitQuantity;

    const backendDiscount = (product as ProductUI).discountPercentage ?? 0;
    const discountPercentage = backendDiscount > 0
      ? backendDiscount
      : oldPrice
        ? discountFromPrices(product.precio, oldPrice)
        : 0;

    return {
      productId: product.id,
      name: product.name,
      imagen: product.imagen,
      unitPrice: product.precio,
      unitLabel: finalUnidad,
      quantity,
      precioTexto: product.precioTexto,
      oldPrice,
      unidad: finalUnidad,
      isOffer: discountPercentage > 0,
      discountPercentage,
      unitQuantity: productQuantity ?? 1,
    };
  }

  /**
   * Restores cart state from localStorage and normalizes fields
   * to ensure backward compatibility with persisted data.
   *
   * LÉGADO: en versiones anteriores se persistía unitLabel fabricado con
   * formatUnitLabel("2 litros"). Ahora conservamos unidad y unitQuantity
   * POR SEPARADO (estructurado). Si detectamos un item legacy, mantenemos
   * su unitLabel crudo tal cual estaba guardado; el componente cart-item
   * usa los campos estructurados (unidad + unitQuantity) como fuente
   * primaria y unitLabel pasa a ser un display-name sin lógica adjunta.
   */
  private rehydrate(): void {
    try {
      const stored = this.storage.get<CartItem[]>(this.STORAGE_KEY);
      if (stored && Array.isArray(stored)) {
        const normalized = stored.map((item) => {
          const discountPct = discountFromPrices(item.unitPrice, item.oldPrice);
          const qtyForLabel = item.unitQuantity ?? item.quantity;
          return {
            ...item,
            discountPercentage: discountPct,
            isOffer: discountPct > 0,
            unidad: item.unidad ?? undefined,
            unitQuantity: qtyForLabel,
          };
        });
        this._localCart = [...normalized];
        this._cartItems.set(normalized);
      }
    } catch (error) {
      console.error('Error rehydrating cart from localStorage:', error);
    }
  }

  /**
   * Extrae el NOMBRE de la unidad desde un product (campo explícito unidad).
   * SOLO nombre; cantidad va por separado en quantity/unitQuantity.
   * No parsea precios ni strings compuestos.
   */
  private extractUnidadName(product: Product): string | undefined {
    if (product.unidad && product.unidad.trim().length > 0) {
      return product.unidad.trim();
    }
    return undefined;
  }
}