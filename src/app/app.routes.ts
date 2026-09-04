import { Routes } from '@angular/router';
import { SeoConfig } from '@core/types/seo';
import { BRAND_NAME } from '@core/constants';
import { ShopLayoutComponent } from './layouts/shop-layout/shop-layout.component';
import { requireAuthGuard, redirectIfAuthenticatedGuard } from './features/auth/guards/auth.guards';
import { helpCategoryGuard, helpTopicGuard } from './features/help/guards/help.guard';

const seo = (config: SeoConfig) => config;

export const routes: Routes = [
  {
    path: '',
    component: ShopLayoutComponent,
    children: [
      {
        path: '',
        loadComponent: () => import('./features/home/pages/home-page/home-page.component').then(m => m.HomePageComponent),
        data: {
          seo: seo({
            titleKey: 'home.seo.title',
            descriptionKey: 'home.seo.description',
            canonicalPath: '/',
            jsonLd: null
          })
        }
      },
      {
        path: 'category/:id/:subcategory',
        loadComponent: () => import('./features/category/category-page.component').then(m => m.CategoryPageComponent),
        data: { seo: seo({ jsonLd: null }) }
      },
      {
        path: 'category/:id',
        loadComponent: () => import('./features/category/category-page.component').then(m => m.CategoryPageComponent),
        data: {
          seo: seo({
            jsonLd: null
          })
        }
      },
      {
        path: 'product/:id',
        loadComponent: () => import('./features/product/product-page.component').then(m => m.ProductPageComponent),
        data: {
          seo: seo({
            jsonLd: null
          })
        }
      },
      {
        path: 'offers',
        loadComponent: () => import('./features/offers/offers-page/offers-page.component').then(m => m.OffersPageComponent),
        data: {
          seo: seo({
            titleKey: 'offers.seo.title',
            descriptionKey: 'offers.seo.description',
            canonicalPath: '/offers',
            jsonLd: {
              '@context': 'https://schema.org',
              '@type': 'CollectionPage',
              name: `Ofertas - ${BRAND_NAME}`,
              description: 'Productos con descuento activo para comprar hoy.',
              url: '/offers'
            }
          })
        }
      },
      {
        path: 'contact',
        loadComponent: () => import('./features/contact/contact-page/contact-page.component').then(m => m.ContactPageComponent),
        data: {
          seo: seo({
            titleKey: 'contact.seo.title',
            descriptionKey: 'contact.seo.description',
            canonicalPath: '/contact',
            jsonLd: {
              '@context': 'https://schema.org',
              '@type': 'ContactPage',
              name: `Contacto - ${BRAND_NAME}`,
              description: 'Soporte de compras, entregas y disponibilidad de productos.',
              url: '/contact'
            }
          })
        }
      },
      {
        path: 'help',
        loadComponent: () => import('./features/help/pages/help-page/help-page.component').then(m => m.HelpPageComponent),
        data: {
          seo: seo({
            titleKey: 'help.seo.index.title',
            descriptionKey: 'help.seo.index.description',
            canonicalPath: '/help',
            jsonLd: null
          })
        }
      },
      {
        path: 'help/:category',
        canActivate: [helpCategoryGuard],
        loadComponent: () => import('./features/help/pages/help-category-page/help-category-page.component').then(m => m.HelpCategoryPageComponent),
        data: {
          seo: seo({
            canonicalPath: '/help',
            jsonLd: null
          })
        }
      },
      {
        path: 'help/:category/:topic',
        canActivate: [helpTopicGuard],
        loadComponent: () => import('./features/help/pages/help-topic-page/help-topic-page.component').then(m => m.HelpTopicPageComponent),
        data: {
          seo: seo({
            canonicalPath: '/help',
            jsonLd: null
          })
        }
      },
      {
        path: 'not-found',
        loadComponent: () => import('./features/not-found/not-found-page.component').then(m => m.NotFoundPageComponent),
        data: {
          seo: seo({
            titleKey: 'notFound.seo.title',
            descriptionKey: 'notFound.seo.description',
            jsonLd: null,
            robots: 'noindex, nofollow'
          })
        }
      },
      {
        path: 'legal/terms',
        loadComponent: () => import('./features/legal/terms-page.component').then(m => m.TermsPageComponent),
        data: {
          seo: seo({
            titleKey: 'legal.terms.seo.title',
            descriptionKey: 'legal.terms.seo.description',
            canonicalPath: '/legal/terms',
            jsonLd: {
              '@context': 'https://schema.org',
              '@type': 'WebPage',
              name: 'Terminos y condiciones',
              url: '/legal/terms'
            }
          })
        }
      },
      {
        path: 'legal/privacy',
        loadComponent: () => import('./features/legal/privacy-page.component').then(m => m.PrivacyPageComponent),
        data: {
          seo: seo({
            titleKey: 'legal.privacy.seo.title',
            descriptionKey: 'legal.privacy.seo.description',
            canonicalPath: '/legal/privacy',
            jsonLd: {
              '@context': 'https://schema.org',
              '@type': 'WebPage',
              name: 'Privacidad',
              url: '/legal/privacy'
            }
          })
        }
      },
      {
        path: 'cart',
        loadComponent: () => import('./features/cart/components/cart-page/cart-page.component').then(m => m.CartPageComponent),
        data: {
          seo: seo({
            titleKey: 'common.cart.seo.title',
            descriptionKey: 'common.cart.seo.description',
            canonicalPath: '/cart',
            jsonLd: null,
            robots: 'noindex, nofollow'
          })
        }
      },
{
        path: 'search',
        loadComponent: () => import('./features/search/components/search-page/search-page.component').then(m => m.SearchPageComponent),
        data: {
          seo: seo({
            titleKey: 'search.seo.title_empty',
            descriptionKey: 'search.seo.desc_empty',
            canonicalPath: '/search',
            robots: 'noindex, nofollow',
            jsonLd: {
              '@context': 'https://schema.org',
              '@type': 'CollectionPage',
              name: 'Busqueda de productos',
              description: `Resultados de busqueda del catalogo de ${BRAND_NAME}.`,
              url: '/search'
            }
          })
        }
      },
      {
        path: 'login',
        canActivate: [redirectIfAuthenticatedGuard],
        loadComponent: () => import('./features/auth/pages/login-page/login-page.component').then(m => m.LoginPageComponent),
        data: {
          seo: seo({
            titleKey: 'auth.login.seo.title',
            descriptionKey: 'auth.login.seo.description',
            canonicalPath: '/login',
            robots: 'noindex, nofollow',
            jsonLd: null
          })
        }
      },
      {
        path: 'register',
        canActivate: [redirectIfAuthenticatedGuard],
        loadComponent: () => import('./features/auth/pages/register-page/register-page.component').then(m => m.RegisterPageComponent),
        data: {
          seo: seo({
            titleKey: 'auth.register.seo.title',
            descriptionKey: 'auth.register.seo.description',
            canonicalPath: '/register',
            robots: 'noindex, nofollow',
            jsonLd: null
          })
        }
      },
      {
        path: 'account',
        canActivate: [requireAuthGuard],
        loadComponent: () => import('./features/auth/pages/account-page/account-page.component').then(m => m.AccountPageComponent),
        data: {
          seo: seo({
            titleKey: 'auth.account.seo.title',
            descriptionKey: 'auth.account.seo.description',
            canonicalPath: '/account',
            robots: 'noindex, nofollow',
            jsonLd: null
          })
        }
      },
      {
        path: 'addresses',
        canActivate: [requireAuthGuard],
        loadComponent: () => import('./features/addresses/pages/addresses-page/addresses-page.component').then(m => m.AddressesPageComponent),
        data: {
          seo: seo({
            titleKey: 'addresses.seo.title',
            descriptionKey: 'addresses.seo.description',
            canonicalPath: '/addresses',
            robots: 'noindex, nofollow',
            jsonLd: null
          })
        }
      },
      {
        path: 'checkout',
        canActivate: [requireAuthGuard],
        loadComponent: () => import('./features/orders/pages/checkout-page/checkout-page.component').then(m => m.CheckoutPageComponent),
        data: {
          seo: seo({
            titleKey: 'checkout.seo.title',
            descriptionKey: 'checkout.seo.description',
            canonicalPath: '/checkout',
            robots: 'noindex, nofollow',
            jsonLd: null
          })
        }
      },
      {
        path: 'orders',
        canActivate: [requireAuthGuard],
        loadComponent: () => import('./features/orders/pages/orders-page/orders-page.component').then(m => m.OrdersPageComponent),
        data: {
          seo: seo({
            titleKey: 'orders.seo.list.title',
            descriptionKey: 'orders.seo.list.description',
            canonicalPath: '/orders',
            robots: 'noindex, nofollow',
            jsonLd: null
          })
        }
      },
      {
        path: 'orders/:id',
        canActivate: [requireAuthGuard],
        loadComponent: () => import('./features/orders/pages/order-detail-page/order-detail-page.component').then(m => m.OrderDetailPageComponent),
        data: {
          seo: seo({
            titleKey: 'orders.seo.detail.title',
            descriptionKey: 'orders.seo.detail.description',
            canonicalPath: '/orders/:id',
            robots: 'noindex, nofollow',
            jsonLd: null
          })
        }
      },
      {
        path: '**',
        loadComponent: () => import('./features/not-found/not-found-page.component').then(m => m.NotFoundPageComponent),
        data: {
          seo: seo({
            titleKey: 'notFound.seo.title',
            descriptionKey: 'notFound.seo.description',
            jsonLd: null,
            robots: 'noindex, nofollow'
          })
        }
      }
    ]
  }
];
