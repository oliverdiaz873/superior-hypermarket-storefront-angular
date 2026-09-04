# Superior Hypermarket Storefront - Angular

Angular hypermarket storefront built with Angular Standalone Components, TypeScript, Angular Signals, @ngx-translate, Tailwind CSS, and local static catalog data.

## System Architecture

This repository is a **Customer Storefront** of the **Hipermercado Superior** ecosystem. It consumes the centralized REST API provided by the backend.

```
                    Hipermercado Superior Ecosystem

        superior-hypermarket-api
                         Express REST API
                                  |
        -----------------------------------------------------------------
        |                           |                            |
        |                           |                            |
superior-hypermarket-    superior-hypermarket-      superior-hypermarket-
storefront-next          storefront-angular         dashboard

   Next.js Storefront         Angular Storefront      Angular Admin Dashboard
      (Customer App)            (Customer App)              (Admin App)
                                  |
                                  ▼
                             MongoDB

                  superior-hypermarket-e2e (Playwright)
                  Central E2E infrastructure for the ecosystem
```

| Repository | Type | Technology | Purpose |
|------------|------|------------|---------|
| superior-hypermarket-api | Backend API | Express + MongoDB + JWT | Central system API |
| superior-hypermarket-storefront-next | Customer Frontend | Next.js + React | Public storefront |
| superior-hypermarket-storefront-angular | Customer Frontend | Angular | Alternative public storefront |
| superior-hypermarket-dashboard | Admin Frontend | Angular + Material + NgRx Signals | Admin dashboard |
| superior-hypermarket-e2e | E2E Harness | Playwright | Centralized end-to-end testing infrastructure |

**Backend Dependency** — This application requires the backend repository
`superior-hypermarket-api`, which provides the centralized REST API for the ecosystem.

### Centralized E2E Harness

`superior-hypermarket-e2e` is the ecosystem's independent **End-to-End testing
repository (Playwright)**. It contains no business logic: it is validation
infrastructure that orchestrates and validates several repositories at once,
exercising full flows (frontend → backend → persistence → dashboard) while
centralizing fixtures, helpers, configuration, and E2E specs.

[Centralized E2E Harness - superior-hypermarket-e2e](https://github.com/oliverdiaz873/superior-hypermarket-e2e)

```
Storefronts (Next · Angular) · Admin Dashboard
        │
        ▼
superior-hypermarket-api (Express REST API)
        │
        ▼
MongoDB
```

## Documentation

Start with [docs/getting-started.md](docs/getting-started.md).

Core documentation:
- [Architecture](docs/ARCHITECTURE.md)
- [Folder Structure](docs/folder-structure.md)
- [Internationalization](docs/I18N_GUIDE.md)
- [Migration Plan](docs/MIGRATION_PLAN.md)
- [Migration Gaps Audit](docs/migration-gaps.md)
- [Documentation Migration Plan](docs/DOCS_MIGRATION_PLAN.md)

Features:
- [Help Center](docs/features/help.md)
- [Contact](docs/features/contact.md)
- [Cart](docs/features/cart.md)
- [Products](docs/features/products.md)
- [Search](docs/features/search.md)
- [Home](docs/features/home.md)

## Project Overview

The project is a frontend storefront application migrated from Next.js to Angular.

Product, category, offer, and product-detail data are currently stored in local TypeScript modules under `src/app/data/`.

This application consumes the centralized REST API provided by
`superior-hypermarket-api`.

## Main Features

- Locale-aware translations with `@ngx-translate/core`.
- Home page with hero carousel, offers carousel, featured products, category banners, and about section.
- Product detail pages with dynamic SEO metadata and JSON-LD.
- Category pages built from local category and product data.
- Offers page with filtering and discount badges.
- Client-side search system with normalized text matching.
- Client-side cart using Angular Signals and `localStorage`.
- Public Help Center (`/help`, 7 categories, 21 topics) with contextual Contact (`/contact?category&topic`) and authenticated prefill.
- Contact form with contextual Help banner and authenticated prefill.
- Legal pages using translation content.
- Responsive desktop, tablet, and mobile navigation.

## Tech Stack

- Angular `21.2.0`
- TypeScript
- Angular Router
- Angular Standalone Components
- Angular Signals
- `@ngx-translate/core`
- Tailwind CSS `4.3.1`
- RxJS
- Vitest

## Project Structure

```text
src/
├── app/
│   ├── core/       # Singleton services, types, utils, i18n config
│   ├── data/       # Local catalog data (products, categories, etc.)
│   ├── features/   # Business feature modules (cart, home, offers, etc.)
│   ├── layouts/    # Layout components (shop-layout)
│   └── shared/     # Reusable UI components (skeleton, toast, etc.)
├── assets/
│   └── i18n/       # Translation JSON files (es.json, en.json)
└── styles.css      # Global styles
```

## Getting Started

```bash
npm install
npm start
```

Other commands:
```bash
ng serve
npm run build
npm test
```

## License

[LICENSE](LICENSE)
