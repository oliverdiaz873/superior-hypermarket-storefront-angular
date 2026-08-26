import { describe, it, expect } from 'vitest';
import { resolveProductImageUrl } from './product-image.resolver';

describe('resolveProductImageUrl', () => {
  it('usa tal cual las URLs absolutas', () => {
    expect(resolveProductImageUrl('https://cdn.example.com/products/a.webp?v=2026-01-01T00:00:00.000Z')).toBe(
      'https://cdn.example.com/products/a.webp?v=2026-01-01T00:00:00.000Z'
    );
    expect(resolveProductImageUrl('http://localhost:3000/uploads/x.avif', 'http://localhost:3000')).toBe(
      'http://localhost:3000/uploads/x.avif'
    );
    expect(resolveProductImageUrl('data:image/png;base64,abc')).toBe('data:image/png;base64,abc');
  });

  it('no convierte keys legacy products/... - la API ya normaliza a URL pública', () => {
    expect(resolveProductImageUrl('products/bebidas/coca-cola.avif')).toBe(
      'products/bebidas/coca-cola.avif'
    );
    expect(resolveProductImageUrl('products/bebidas/coca-cola.avif', '')).toBe(
      'products/bebidas/coca-cola.avif'
    );
  });

  it('preserva una URL relativa /uploads sin duplicar el prefijo', () => {
    expect(resolveProductImageUrl('/uploads/products/p1/image.png?v=1')).toBe(
      '/uploads/products/p1/image.png?v=1'
    );
  });

  it('no convierte contra CDN en frontend - la API ya resuelve con base pública', () => {
    expect(resolveProductImageUrl('products/bebidas/coca-cola.avif', 'https://cdn.hipermercadosuperior.com')).toBe(
      'products/bebidas/coca-cola.avif'
    );
  });

  it('retorna tal cual keys con slash inicial (sin normalización frontend)', () => {
    expect(resolveProductImageUrl('/products/bebidas/coca-cola.avif', 'https://cdn.hipermercadosuperior.com')).toBe(
      '/products/bebidas/coca-cola.avif'
    );
    expect(resolveProductImageUrl('/products/bebidas/coca-cola.avif')).toBe('/products/bebidas/coca-cola.avif');
  });

  it('devuelve null si no hay imagen', () => {
    expect(resolveProductImageUrl(null)).toBeNull();
    expect(resolveProductImageUrl(undefined)).toBeNull();
    expect(resolveProductImageUrl('')).toBeNull();
  });
});
