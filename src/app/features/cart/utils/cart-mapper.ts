/**
 * Mapper Backend → UI (A2).
 *
 * El servidor es la fuente de verdad de cantidades, precios y ofertas (snapshot).
 * Este módulo solo transforma el `ApiCart` (CartResponse) al modelo visual
 * `CartItem` y construye el payload del merge descartando cualquier
 * precio/oferta del lado local. Funcionalmente idéntico a cart-mapper de N2.
 */
import type { CartItem } from '../types/cart.interface';
import type { ApiCart, ApiCartItem, CartMergeItem } from '../types/cart-api.interface';
import { resolveProductImageUrl } from '@core/api/product-image.resolver';

/** Convierte un item del backend al modelo visual. */
export const toUiCartItem = (item: ApiCartItem): CartItem => ({
  productId: item.productId,
  name: item.name,
  imagen: resolveProductImageUrl(item.image) ?? '',
  unitPrice: item.unitPrice,
  unitLabel: (() => {
    const raw = item.unit?.trim();
    return raw && raw.length > 0 ? raw : undefined;
  })(),
  quantity: item.quantity,
  oldPrice: item.originalPrice != null ? String(item.originalPrice) : undefined,
  isOffer: item.isOffer,
  discountPercentage: item.discountPercentage,
  unitQuantity: item.unitQuantity,
});

/** Convierte un CartResponse completo al listado visual. */
export const uiCartFromServer = (cart: ApiCart): CartItem[] => cart.items.map(toUiCartItem);

/**
 * Cálculo local y puro del porcentaje de descuento como fallback del
 * `discountPercentage` real del backend (F5.4). El precio final nunca se
 * recalcula de local: lo trae siempre el snapshot servidor.
 */
export const discountFromPrices = (price: number, oldPrice?: string): number => {
  const numericOld = Number.parseFloat((oldPrice ?? '').replace(/[^\d.-]/g, ''));
  if (!Number.isFinite(numericOld) || numericOld <= 0) return 0;
  return Math.round(((numericOld - price) / numericOld) * 100);
};

/**
 * Payload de merge a partir de items locales. Solo { productId, quantity }:
 * para precios/ofertas nunca se usa el valor local (server-wins).
 */
export const toMergePayload = (items: CartItem[]): CartMergeItem[] =>
  items.map(({ productId, quantity }) => ({ productId, quantity }));