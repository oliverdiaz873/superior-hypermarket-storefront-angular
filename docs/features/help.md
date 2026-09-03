# Help Center

## Status

Implemented — Fase 1 cerrada.

## Overview

Public self-service hub at `/help`. Static content from `src/app/features/help/help.content.ts` and `src/assets/i18n/{es,en}.json` `help` namespace (no CMS, no backend search).

Structure: 7 categories and 21 topics.

- `orders`: track, cancel, address, late-delivery (4)
- `returns`: policy, damaged, refund (3)
- `account`: create, login, data, logout (4)
- `payments`: methods, pending, invoice (3)
- `products`: availability, offers, search (3)
- `stores`: contact, pickup (2)
- `other`: privacy, other (2)

Navigation: `Footer → Help Center → Category → Topic → Resolution → Contact`.

## Routes

| Route | File | Access | SEO |
| --- | --- | --- | --- |
| `/help` | `src/app/features/help/pages/help-page/help-page.component.ts` | Public | `help.seo.index` `canonical /help` |
| `/help/:category` | `src/app/features/help/pages/help-category-page/help-category-page.component.ts` | Public, `isValidHelpCategory` → `UrlTree /not-found` + `robots noindex` | `help.seo.category` `title_template` + `canonical /help/:category` |
| `/help/:category/:topic` | `src/app/features/help/pages/help-topic-page/help-topic-page.component.ts` | Public, `isValidHelpTopic` → `/not-found` | `help.topics.*.seo` + `canonical /help/:category/:topic` |
| `/not-found` | `src/app/features/not-found/not-found-page.component.ts` | Public | `notFound.seo` `robots noindex` |

Invalid category/topic shows `help.empty` and redirects to `/not-found` via `help.guard.ts` (`helpCategoryGuard`, `helpTopicGuard`). SSR currently returns HTTP 200 with not-found content (debt, not 404).

`app.routes.ts` registers `help`, `help/:category` `canActivate:[helpCategoryGuard]`, `help/:category/:topic` `canActivate:[helpTopicGuard]`, `not-found`, `**`.

## Page Flow

1. `help-page` renders `HelpLayout` hero `help.hero.title/subtitle`, banner `AuthService.status() === 'authenticated' ? View my orders → /orders : Sign in → /login?returnUrl=/help`, grid 7 `help-card` (`help.categories`, `help.category_descriptions`), CTA `Contact`.
2. `help-category-page` renders `HelpLayout` `categoryName` + `categoryDescription`, `help-topic-list` with `help.topics.{cat}.{topic}.title/intro`, CTA `Contact?category`, back `help.actions.back_to_help`.
3. `help-topic-page` renders `HelpLayout` title, `help-article` `intro`, `help-steps` numbered pills, `help-note`, `help-related`, CTA `Contact?category&topic` + `View my orders` if `orders`, `ResolutionBlock` (`help.resolution.question` Yes→`Toast` `help.resolution.thanks`, No→`/contact?category&topic`), back links.
4. Breadcrumbs `shared/components/breadcrumb` with `common.breadcrumb.home` + `help.breadcrumb.help_center`.

## Primary Files

- `src/app/features/help/help.content.ts` — `HELP_CATEGORIES` allowlist `isValidHelpCategory`, `isValidHelpTopic`
- `src/app/features/help/components/help-layout/help-layout.component.ts` — `dark-theme-body` via `isPlatformBrowser`
- `src/app/features/help/components/help-layout/help-layout.component.scss` — `help-container`, `help-grid` 3→2→1, `help-card`, `help-pill`, `help-resolution`
- `src/app/features/help/components/resolution-block/resolution-block.component.ts`
- `src/app/features/help/guards/help.guard.ts` — `helpCategoryGuard`, `helpTopicGuard` → `/not-found`
- `src/app/features/help/pages/help-page/*`, `help-category-page/*`, `help-topic-page/*`
- `src/app/features/help/help.content.spec.ts` — 7/21, ascii, `isValid*`
- `src/assets/i18n/es.json` / `en.json` `help` namespace

## i18n

`@ngx-translate` (`src/app/core/i18n/i18n.config.ts` `localStorage language`, `assets/i18n/`), not Next `next-intl` URL prefix.

- Locales `es` default, `en`. Routes are `/help` for both (Next uses `/es/help` `/en/help` with `next-intl` `proxy.ts`).
- Namespace `help` in `src/assets/i18n/es.json:222` / `en.json:222` with `seo, hero, categories(7), category_descriptions(7), topics(21), actions, resolution, contact_context, empty` — parity `es/en`.
- `account.help_cta/help_description` in `auth.account` for `Account → Help` CTA.

## SEO & Sitemap

- `SeoService:applySeo` with `canonicalPath` `/help`, `/help/:category`, `/help/:category/:topic` via `SITE_URL` (`core/constants.ts` `https://hipermercadosuperior.com`). `SeoConfig` supports `alternates` for `hreflang` but Help Fase 1 does not use it (debt).
- `scripts/generate-sitemap.js` reads `help.content.ts` single source and generates 29 Help URLs (`/help` 0.8, `/help/:category` 0.6, `/help/:category/:topic` 0.5 `weekly`) — Next generates 58 with `/en` prefix, Angular 29 because no locale prefix in URL (intentional difference).
- `src/app/robots.ts` `allow:/, disallow:/cart,/api` — `/help` indexable.

## Current Limitations / Debt

- SSR `/not-found` returns HTTP 200, not 404 (guard renders `NotFoundPageComponent` with `noindex` but status remains 200).
- `SeoService` `hreflang` not used for Help (alternates `es/en/x-default` pending).
- No Help search (`help.hero.search_placeholder` exists).
- No `orderId`/chips/order selector in `ResolutionBlock` / `Contact` — Fase 2.
- No dedicated Help `loading` skeletons (content is synchronous).
- Help tests limited to `help.content.spec.ts` and `resolution-block` (no page SEO tests).
