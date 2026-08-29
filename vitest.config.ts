import { defineConfig } from 'vitest/config';
import { fileURLToPath, URL } from 'node:url';

/**
 * Configuración standalone de Vitest (fuera de @angular/build:unit-test).
 *
 * Propósito: permitir `npx vitest run <file>` desde CLI resolviendo
 * correctamente los path aliases de tsconfig.json (@core/*, @features/*,
 * @shared/*, @data/*).
 *
 * El builder de Angular (@angular/build:unit-test, runner=vitest) gestiona
 * sus propios aliases internamente y no lee este archivo; es seguro
 * tener ambos coexistiendo.
 */
export default defineConfig({
  resolve: {
    alias: {
      '@core': fileURLToPath(new URL('./src/app/core', import.meta.url)),
      '@features': fileURLToPath(new URL('./src/app/features', import.meta.url)),
      '@shared': fileURLToPath(new URL('./src/app/shared', import.meta.url)),
      '@data': fileURLToPath(new URL('./src/app/data', import.meta.url)),
    },
  },
});
