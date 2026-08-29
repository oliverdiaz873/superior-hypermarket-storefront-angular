import { ApiProduct } from '@core/api/api-types';
import { resolveProductImageUrl } from '@core/api/product-image.resolver';
import { Product } from '@core/types/product.interface';
import { ProductUI } from '@features/products/models/product-ui.interface';

/**
 * Mapper F5.2: ApiProduct (backend Express+MongoDB) → modelo UI del storefront.
 *
 * Decisiones F5.0:
 * - `price` → `precio`, `unit` → `unidad`, `unitQuantity` → `quantity`.
 * - `category.slug` → `categoria` (la identidad navegable es el slug).
 * - `url` y `precioTexto` se generan en el frontend (no vienen del backend).
 * - `image` se resuelve con el resolver de imágenes (nunca se toca el backend).
 * - `precioTexto` representa SOLO el precio base; la presentación de unidad/cantidad
 *   se delega a `formatProductPrice()` / `formatUnitLabel()` en `price-utils.ts`.
 */
export function mapApiProductToProductUI(api: ApiProduct): Product {
  const imagen = resolveProductImageUrl(api.image) ?? '';
  const unit = api.unit ?? '';
  const quantity = api.unitQuantity;

  const precioTexto = `Precio: $${api.price.toLocaleString('en-US')}`;

  return {
    id: api.id,
    name: api.name,
    description: api.description,
    url: `/product/${encodeURIComponent(api.id)}`,
    categoria: api.category.slug,
    subcategoryId: api.subcategoryId ?? null,
    precio: api.price,
    precioTexto,
    imagen,
    unidad: unit || undefined,
    quantity,
  };
}

/** Map a full list of API products, skipping inactive/unavailable ones. */
export function mapApiProductsToProductUI(apiProducts: ApiProduct[]): Product[] {
  return apiProducts
    .filter((p) => p.status === 'active' && p.isAvailable)
    .map(mapApiProductToProductUI);
}

export function toProductUI(product: Product): ProductUI {
  return {
    ...product,
    oldPrice: undefined,
    discountPercentage: undefined,
  };
}
