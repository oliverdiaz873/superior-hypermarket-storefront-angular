/**
 * Represents a single item in the shopping cart.
 * Mirrors the CartItem interface from Next.js (CartContext.tsx)
 * with renamed fields to match Angular conventions.
 */
export interface CartItem {
  productId: string;
  name: string;
  imagen: string;
  unitPrice: number;
  unitLabel?: string;
  quantity: number;
  precioTexto?: string;
  oldPrice?: string;
  unidad?: string;
  isOffer?: boolean;
  discountPercentage?: number;
  unitQuantity?: number;
}

export interface CartState {
  items: CartItem[];
}

/** Estado de resolución del carrito respecto a la sesión (Análogo de N2). */
export type CartMode = 'loading' | 'anonymous' | 'authenticated';
