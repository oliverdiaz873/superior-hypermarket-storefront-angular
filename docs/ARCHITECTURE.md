# Architecture

## Overview

Hypermarket Angular uses a feature-based architecture with Angular Standalone Components.

The project is organized into:
- core: Application-wide services, types, utils, and i18n config
- data: Local catalog data
- features: Business feature modules (cart, home, offers, etc.)
- shared: Reusable UI components (skeleton, toast, breadcrumb, etc.)
- layouts: Layout components (shop-layout with header/footer)

---

## Angular Patterns

### Standalone Components
All components use Angular standalone architecture.

Benefits:
- No NgModules required
- Better lazy loading support
- Reduced boilerplate

### Signals State Management
Reactive state is managed using Angular Signals.

Example:
CartService
├── WritableSignal (cartItems)
├── computed signals (totalItems, totalPrice)
└── effects (localStorage persistence)

---

## Routing
The application uses Angular Router.

Main routes:
```
/
├── /category/:id
├── /product/:id
├── /offers
├── /search
├── /cart
├── /contact
├── /help
├── /help/:category
├── /help/:category/:topic
├── /legal/terms
├── /legal/privacy
└── /** (catch-all 404)
```

---

## Detailed Structure

### core/
Purpose: Contains reusable, singleton code used across the entire application. Must not depend on any feature.

- services/: Singleton services (SeoService, ViewportService) — CartService lives in features/cart/services/
- types/: Global TypeScript interfaces (Product, Category, etc.)
- utils/: Pure utility functions (asset-utils, price-utils, search-utils)
- i18n/: Internationalization configuration (@ngx-translate)

### data/
Purpose: Stores all static application data (no external API).

- products.data.ts: Product catalog
- categories.data.ts: Categories and subcategories
- product-page.data.ts: Editorial content for product detail pages
- category-section-map.data.ts: Slug → category mapping utilities
- catalog.helpers.ts: Catalog helper functions
- (Offers data lives in features/offers/data/offers.data.ts)

### features/
Purpose: Self-contained business modules, organized by feature.

Existing features:
- cart/: Shopping cart (service in cart/services/, components in cart/components/)
- category/: Category pages
- contact/: Contact form with Help contextual banner and authenticated prefill
- help/: Help Center (help.content.ts 7cat/21topics, guards, 3 pages, HelpLayout, ResolutionBlock)
- home/: Homepage (HeroCarousel, CategoryBanners, AboutUs)
- layout/: Layout components (Header without Contact in nav, Footer Help+Cuenta+Legal)
- legal/: Legal pages (terms, privacy)
- navigation/: Responsive navigation (Desktop/Mobile/Tablet without Contact)
- not-found/: 404 page
- offers/: Offers page (data in offers/data/, components in offers/components/)
- product/: Product detail page
- products/: Reusable product components (pipes in products/pipes/)
- search/: Product search system

### shared/
Purpose: Reusable UI components, directives, and pipes used across features.

Components:
- breadcrumb/: Navigational breadcrumbs
- drawer/: Sliding side panel
- empty-state/: Generic empty state
- icons/: Inline SVG icon components
- language-selector/: Language switcher (es/en)
- scroll-to-top/: Floating scroll-to-top button
- skeleton/: Loading skeleton variants (BaseSkeleton, HeroBannerSkeleton, etc.)
- toast/: Toast notification system (component + service)

### layouts/
Purpose: Application-level layout wrappers.

- shop-layout/: Main layout with Header, Footer, Cart indicators, and ScrollToTop
