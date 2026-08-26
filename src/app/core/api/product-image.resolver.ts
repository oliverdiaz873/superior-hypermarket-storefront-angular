import { getStoragePublicUrl } from './api.config';

/**
 * Resuelve la URL pública de una imagen de producto (contrato único F5.0 normalizado).
 *
 * Regla normalizada:
 * - La API devuelve siempre una URL pública (`/uploads/...?v=` en dev local,
 *   `https://cdn/.../uploads/...?v=` en prod) o `null`. Ver
 *   `src/modules/products/presenters/product.presenter.ts:73` (API).
 * - El frontend consume la URL tal cual, sin convertir keys legacy `products/...`.
 *   La conversión legacy `products/... -> /uploads/...` vive únicamente en la API
 *   para compatibilidad controlada; el cliente no duplica esa lógica.
 * - `?v=` se preserva si viene en la respuesta; el cliente NUNCA genera versiones.
 * - `storagePublicUrl` se conserva en la firma por compatibilidad pero ya no se
 *   usa para imágenes de productos (solo para assets estáticos via getAssetUrl).
 */
export const resolveProductImageUrl = (
  image: string | null | undefined,
  _storagePublicUrl = getStoragePublicUrl()
): string | null => {
  if (!image) return null;

  if (
    image.startsWith('http://') ||
    image.startsWith('https://') ||
    image.startsWith('data:') ||
    image.startsWith('/uploads/')
  ) {
    return image;
  }

  return image;
};
