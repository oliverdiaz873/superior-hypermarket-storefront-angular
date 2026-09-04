# Guía de Internacionalización (i18n)

Este proyecto usa `@ngx-translate/core` y `@ngx-translate/http-loader` para la internacionalización, soportando los idiomas español (es) e inglés (en).

---

## Translation Layers
El proyecto tiene dos sistemas de traducción:

### 1. Static UI Translations
Usados para todos los elementos de interfaz de usuario (botones, etiquetas, encabezados, etc.).

Archivos:
```
assets/i18n/
├── es.json
└── en.json
```

Organizados por namespaces:
```json
{
  "common": { ... },    // Includes cart, product, units, breadcrumb, etc.
  "header": { ... },
  "footer": { ... },
  "home": { ... },
  "categories": { ... },
  "offers": { ... },
  "search": { ... },
  "contact": { ... },
  "help": { ... },      // Help Center 7cat/21topics, seo, hero, category_descriptions, topics, actions, resolution, contact_context
  "auth": { ... },      // Includes account.help_cta/help_description for Account→Help
  "legal": { ... },
  "products": { ... }   // Dynamic product translations (name, description, specs)
}
```

### 2. Dynamic Product Translations
Los productos usan campos bilingües directamente en la estructura de datos, con fallback al nombre original.

Ejemplo:
```typescript
// La interfaz Product usa el nombre original como base, con traducciones superpuestas
{
  id: "product-id",
  nombre: "Nombre Original", // Fallback si no hay traducción
  // ... otros campos
}
```

El pipe `ProductTranslatePipe` maneja las traducciones superpuestas desde `assets/i18n/*.json` bajo el namespace `products`:
```json
// assets/i18n/es.json
{
  "products": {
    "televisor_samsung_75_pulgadas": {
      "name": "Televisor Samsung 75 pulgadas",
      "description": "Experimenta una resolución 4K impresionante...",
      "specs": [
        "Resolución: 4K UHD (3840 x 2160)",
        "Smart TV: Tizen OS con apps integradas"
      ]
    }
  }
}
```

---

## Configuración
La configuración de i18n está en `src/app/core/i18n/i18n.config.ts`.

### Parámetros Clave
- Idiomas soportados: `['es', 'en']`
- Idioma por defecto: `es`
- Persistencia: El idioma seleccionado se guarda en `localStorage` con la clave `'language'`
- Carga de traducciones: Los archivos JSON se cargan desde `/assets/i18n/`

### Inicialización
El servicio se inicializa en `app.config.ts` usando la función `provideI18n()`.

---

## Uso en el código

### En templates con el pipe `translate`
```html
<h1>{{ 'home.hero.title' | translate }}</h1>
<button>{{ 'common.product.add_to_cart' | translate }}</button>
```

### En componentes con `TranslateService`
```typescript
import { Component, inject } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';

@Component({ ... })
export class MyComponent {
  private translate = inject(TranslateService);

  submit() {
    const label = this.translate.instant('common.product.add_to_cart');
    console.log(label);
  }
}
```

> **Nota:** Las claves de carrito (`cart`) viven bajo el namespace `common.cart` (ej: `common.cart.summary.total_items`), no como namespace raíz.

### Traducciones superpuestas de productos (ProductTranslatePipe)
Los productos usan un sistema de traducción overlay con fallback al nombre original.

**Pipe `ProductTranslatePipe`** (`features/products/pipes/product-translate.pipe.ts`):
```html
<!-- Busca 'products.{productId}.name'; si no existe, muestra product.nombre como fallback -->
<h2>{{ product.id | productTranslate:product.nombre }}</h2>
```

**Estructura en JSON** (`assets/i18n/*.json`):
```json
{
  "products": {
    "televisor_samsung_75_pulgadas": {
      "name": "Televisor Samsung 75 pulgadas",
      "description": "Descripción traducida...",
      "specs": ["Spec 1", "Spec 2", "Spec 3", "Spec 4", "Spec 5"]
    }
  }
}
```

El pipe busca la clave exacta `products.{productId}.name`. Si no se encuentra, retorna el `fallback` (normalmente `product.nombre` del modelo de datos local).

---

## Cambio de idioma
El componente `LanguageSelector` permite cambiar el idioma. Al cambiarlo:
1. Se actualiza el idioma en `TranslateService`
2. Se guarda la selección en `localStorage`
3. Todas las traducciones se actualizan automáticamente

---

## Añadir nuevas traducciones
1. Añade la nueva clave y su valor en ambos archivos `es.json` y `en.json`
2. Usa la clave en tus templates o componentes

Ejemplo:
```json
// src/assets/i18n/es.json
{
  "common": {
    "newKey": "Nuevo Texto"
  }
}
```
```json
// src/assets/i18n/en.json
{
  "common": {
    "newKey": "New Text"
  }
}
```
```html
<p>{{ 'common.newKey' | translate }}</p>
```
