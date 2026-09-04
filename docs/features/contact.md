# Contact

## Status

Implemented — Fase 1 with Help contextual + prefill.

## Overview

Public contact page at `/contact` with form, validation, business info, and contextual integration from Help Center.

## Primary Files

- `src/app/features/contact/contact-page/contact-page.component.ts` — smart layout, `dark-theme-body`, `help.contact_context.banner` + `go_help` → `/help`, delegates to `ContactForm` with `initialName/initialEmail` from `AuthService`
- `src/app/features/contact/components/contact-form/contact-form.component.ts` — Reactive Forms `nombre/email/telefono/mensaje`, `@Input() initialName/initialEmail` → `ngOnInit/OnChanges` `applyInitialValues()` respecting `dirty`, `ContactFormService` validators, `ApiService.sendContactMessage` `POST /api/contact`
- `src/app/features/contact/services/contact-form.service.ts` — `trimmedRequired`, `alphabeticValidator` `/^[a-zA-ZáéíóúñÑ\s]+$/`, `emailValidator` RFC 254, `phoneValidator` 8-15 digits
- `src/assets/i18n/es.json` / `en.json` `contact` namespace — `seo`, `form` labels/placeholders/buttons, `validation`, `info`, `help.contact_context` banner

## Route Flow

1. `/contact` public (no guard). `contact-page.component.ts` injects `AuthService` (`ShopLayout` already `initialize()`) and passes `initialName=user?.name` `initialEmail=user?.email` to `ContactForm`.
2. `ContactForm` `ngOnInit` prefills `nombre/email` if `initialName/Email` and control empty + not dirty; remains editable.
3. `ContactHelp` integration: `HelpTopicPage` `No → /contact?category&topic` and `HelpCategoryPage` `Contact?category` — `contact` validates via `isValidHelpTopic` conceptually but currently only shows banner; full `category/topic/orderId` chips and order selector are Fase 2.
4. On success `Toast` `contact.form.success_toast`.

## i18n

`@ngx-translate` `es` default `en` via `localStorage`, `assets/i18n/` `contact` namespace parity, `help.contact_context.banner` used in `contact-page.component.html`.

## Current Limitations

- `category/topic/orderId` chips, order selector, `orderNumber` visible vs `orderId` technical, and `ApiContactPayload` prefix `[category/topic][pedido:orderId]` are Fase 2 (Next `ContactPageClient` has them, Angular not yet).
- No admin UI for messages (backend persists).
- Rate limiting `429` handled as `contact.form.error.rate_limited`.
