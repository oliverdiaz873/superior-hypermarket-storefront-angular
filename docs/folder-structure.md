# Folder Structure

This document describes the project structure relevant to development and maintenance.

## Root

```text
.
|-- docs/
|-- public/
|-- scripts/
|-- src/
|-- .angular/
|-- .editorconfig
|-- .gitignore
|-- .postcssrc.json
|-- .prettierrc
|-- angular.json
|-- LICENSE
|-- package-lock.json
|-- package.json
|-- README.md
|-- tsconfig.app.json
|-- tsconfig.json
|-- tsconfig.spec.json
`-- vercel.json
```

Generated or dependency directories may also be present:

- `dist/`: Angular build output.
- `node_modules/`: Installed npm dependencies.
- `.git/`: Git repository metadata.
- `.angular/`: Angular CLI cache.

## Root Directories

- `docs/`: Project documentation.
- `public/`: Static assets (favicon, etc.).
- `scripts/`: Local validation and utility scripts.
- `src/`: Application source code.

## Source Structure

```text
src/
|-- app/
|   |-- core/
|   |-- data/
|   |-- features/
|   |-- layouts/
|   |-- shared/
|   |-- app.config.ts
|   |-- app.routes.ts
|   |-- app.ts
|   `-- styles.css (global styles)
|-- assets/
`-- index.html
```

### `src/app/`

The main application code, organized by architectural layer.

#### `core/`

Application-wide singleton services, types, utilities, and configuration.

```text
core/
|-- services/
|   |-- seo.service.ts        # Title + Meta + JSON-LD helper
|   |-- viewport.service.ts   # Responsive viewport detection
|-- types/
|   |-- product.interface.ts  # Product, CartItem interfaces
|   |-- category.interface.ts # Category, Subcategory interfaces
|-- utils/
|   |-- asset-utils.ts        # getAssetUrl() path resolver
|   |-- price-utils.ts        # Price formatting, unit labels
|   |-- search-utils.ts       # Text normalization, search matching
|   |-- url.utils.ts          # URL manipulation helpers
|-- i18n/
|   |-- i18n.config.ts        # @ngx-translate configuration
```

#### `data/`

Static catalog data stored as local TypeScript modules. No external API.

```text
data/
|-- products.data.ts              # 184 products
|-- categories.data.ts            # 8 categories with subcategories
|-- product-page.data.ts          # Editorial content per product
|-- category-section-map.data.ts  # Slug → category mapping
|-- catalog.helpers.ts            # Catalog helper functions
`-- index.ts                      # Barrel exports
```

#### `features/`

Self-contained business modules, organized by domain. Each feature follows an internal structure that may include `components/`, `services/`, `data/`, `pipes/`, and `types/` as needed.

```text
features/
|-- cart/           # Shopping cart (service, components, types)
|-- category/       # Category page
|-- contact/        # Contact form page with Help banner + prefill
|-- help/           # Help Center (help.content.ts, guards, 3 pages, HelpLayout, ResolutionBlock)
|-- home/           # Home page (hero carousel, banners, about)
|-- layout/         # Header (no Contact), Footer (Help 2 + Cuenta 3 + Legal)
|-- legal/          # Terms and Privacy pages
|-- navigation/     # Desktop/tablet/mobile navigation (no Contact)
|-- not-found/      # 404 catch-all page
|-- offers/         # Offers page (data, filters, components)
|-- product/        # Product detail page
|-- products/       # Shared product components (cards, carousels, pipes)
`-- search/         # Search system (components, services)
```

Feature internal structure example (`cart/`):

```text
features/cart/
|-- components/
|   |-- add-to-cart-button/
|   |-- cart-header/
|   |-- cart-item/
|   |-- cart-items-list/
|   |-- cart-layout/
|   |-- cart-page/
|   |-- cart-summary/
|   |-- empty-cart/
|   |-- quantity-controls/
|-- services/
|   |-- cart.service.ts       # Cart state (Signals + localStorage)
`-- types/
    `-- index.ts
```

Feature variations:
- `offers/` has `data/offers.data.ts` for offer-specific data (not in `src/app/data/`).
- `products/` has `pipes/product-translate.pipe.ts` for product name translation overlay.
- `navigation/` has `services/tablet-menu.service.ts` for tablet menu state.

#### `layouts/`

Application-level layout wrappers.

```text
layouts/
`-- shop-layout/
    `-- shop-layout.component.ts  # Header, Footer, ScrollToTop
```

#### `shared/`

Reusable UI components, directives, and pipes used across features.

```text
shared/
|-- components/
|   |-- breadcrumb/        # Navigational breadcrumbs
|   |-- drawer/            # Sliding side panel
|   |-- empty-state/       # Generic empty state
|   |-- icons/             # Inline SVG icons
|   |-- language-selector/ # Language switcher (es/en)
|   |-- scroll-to-top/     # Floating scroll-to-top button
|   |-- skeleton/          # Loading skeleton variants
|   `-- toast/             # Toast notification system
`-- directives/
```

### `src/assets/`

Static assets served by the application.

```text
assets/
`-- i18n/
    |-- es.json    # Spanish translations (~2529 lines)
    `-- en.json    # English translations (~2529 lines)
```

## Configuration Files

- `angular.json`: Angular CLI project configuration.
- `tsconfig.json`: Base TypeScript configuration with path aliases (`@core/*`, `@data/*`, `@features/*`, `@shared/*`, `@layouts/*`).
- `tsconfig.app.json`: TypeScript configuration for the application build.
- `tsconfig.spec.json`: TypeScript configuration for test files.
- `.postcssrc.json`: PostCSS configuration (Tailwind CSS pipeline).
- `vercel.json`: Vercel deployment configuration.

## Documentation

- `docs/ARCHITECTURE.md`: Architectural overview and patterns.
- `docs/I18N_GUIDE.md`: Internationalization guide.
- `docs/MIGRATION_PLAN.md`: Original Next.js → Angular migration plan.
- `docs/migration-gaps.md`: Post-migration gap analysis.
- `docs/DOCS_MIGRATION_PLAN.md`: Documentation migration tracking.
