import { ApiOffer } from '@core/api/api-types';
import { resolveProductImageUrl } from '@core/api/product-image.resolver';
import { ProductUI } from '@features/products/models/product-ui.interface';

/**
 * Mapper F5.4: ApiOffer (backend Express+MongoDB) → modelo UI del storefront.
 *
 * Decisiones F5.4:
 * - `discountPrice` → `precio` y `precioTexto` (única fuente: backend).
 * - `originalPrice` → `oldPrice` (string de display) y `discountPercentage`
 *   se toman del backend tal cual, sin cálculos locales.
 * - `categoryId` → `categoria` (los mismos slugs que filtran las ofertas).
 * - `url` e `imagen` se resuelven en el frontend (igual que F5.2).
 * - `precioTexto` representa SOLO el precio base (precio con descuento);
 *   la presentación de unidad/cantidad se delega a `formatProductPrice()` /
 *   `formatUnitLabel()` en `price-utils.ts`.
 */
export function mapApiOfferToProductUI(api: ApiOffer): ProductUI {
  const imagen = resolveProductImageUrl(api.image) ?? '';
  const unit = api.unit ?? '';
  const quantity = api.unitQuantity;

  const precioTexto = `Precio: $${api.discountPrice.toLocaleString('en-US')}`;

  return {
    id: api.id,
    name: api.name,
    url: `/product/${encodeURIComponent(api.id)}`,
    categoria: api.categoryId,
    precio: api.discountPrice,
    precioTexto,
    imagen,
    unidad: unit || undefined,
    quantity,
    oldPrice: `RD$ ${api.originalPrice.toLocaleString('en-US')}`,
    discountPercentage: api.discountPercentage,
  };
}

export function mapApiOffersToProductUI(apiOffers: ApiOffer[]): ProductUI[] {
  return apiOffers.map(mapApiOfferToProductUI);
}