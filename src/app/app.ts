import { Component, DestroyRef, inject, PLATFORM_ID } from '@angular/core';
import { DOCUMENT, isPlatformBrowser } from '@angular/common';
import { ActivatedRoute, NavigationEnd, Router, RouterOutlet } from '@angular/router';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { filter } from 'rxjs/operators';
import { TranslateService } from '@ngx-translate/core';
import { JsonLdSchema, SeoConfig } from '@core/types/seo';
import { SeoService } from '@core/services/seo.service';
import { StorageService } from '@core/services/storage.service';
import { BRAND_NAME } from '@core/constants';

const fallbackSeo: SeoConfig = {
  title: BRAND_NAME,
  description: `${BRAND_NAME}: tu hipermercado online con alimentos, tecnologia, farmacia, ferreteria, moda y hogar en un solo carrito.`,
  jsonLd: null,
  openGraph: {
    image: '/assets/images/logo/logo.png',
    type: 'website',
    locale: 'es_DO',
    siteName: BRAND_NAME
  },
  twitter: {
    card: 'summary_large_image'
  }
};

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet],
  template: '<router-outlet></router-outlet>',
  styleUrl: './app.scss'
})
export class App {
  private readonly router = inject(Router);
  private readonly route = inject(ActivatedRoute);
  private readonly seo = inject(SeoService);
  private readonly translate = inject(TranslateService);
  private readonly document = inject(DOCUMENT);
  private readonly platformId = inject(PLATFORM_ID);
  private readonly destroyRef = inject(DestroyRef);
  private readonly storage = inject(StorageService);

  private readonly websiteSchema: JsonLdSchema = {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: BRAND_NAME,
    description: `${BRAND_NAME}: tu hipermercado online con alimentos, tecnologia, farmacia, ferreteria, moda y hogar.`,
    url: this.seo.absoluteUrl('/'),
    potentialAction: {
      '@type': 'SearchAction',
      target: `${this.seo.absoluteUrl('/')}search?q={search_term_string}`,
      'query-input': 'required name=search_term_string'
    }
  };

  private readonly organizationSchema: JsonLdSchema = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: BRAND_NAME,
    url: this.seo.absoluteUrl('/'),
    logo: this.seo.absoluteUrl('/assets/images/logo/logo.png'),
    sameAs: [
      'https://www.facebook.com/hipermercadosuperior',
      'https://www.instagram.com/hipermercadosuperior'
    ],
    contactPoint: {
      '@type': 'ContactPoint',
      telephone: '+1-809-555-0199',
      contactType: 'customer service'
    }
  };

  constructor() {
    this.document.documentElement.lang = this.storage.get<string>('language')
      ?? 'es';

    this.seo.setBaseJsonLd([this.websiteSchema, this.organizationSchema]);
    this.router.events
      .pipe(
        filter((event): event is NavigationEnd => event instanceof NavigationEnd),
        takeUntilDestroyed(this.destroyRef)
      )
      .subscribe(() => {
        const activeRoute = this.deepestChild(this.route);
        const routeSeo = activeRoute.snapshot.data['seo'] as SeoConfig | undefined;
        const seoConfig = routeSeo ?? fallbackSeo;

        this.seo.applySeo({
          ...seoConfig,
          canonicalPath: seoConfig.canonicalPath ?? this.router.url,
          openGraph: { ...fallbackSeo.openGraph, ...seoConfig.openGraph },
          twitter: { ...fallbackSeo.twitter, ...seoConfig.twitter }
        });

        if (isPlatformBrowser(this.platformId)) {
          setTimeout(() => {
            this.document.documentElement.dataset['hydrated'] = 'true';
          }, 0);
        }
      });

    this.translate.onLangChange
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((event) => {
        this.document.documentElement.lang = event.lang;
        this.seo.refreshSeo();
      });
  }

  private deepestChild(route: ActivatedRoute): ActivatedRoute {
    let activeRoute = route;

    while (activeRoute.firstChild) {
      activeRoute = activeRoute.firstChild;
    }

    return activeRoute;
  }
}
