import { DOCUMENT, isPlatformBrowser } from '@angular/common';
import { inject, Injectable, PLATFORM_ID } from '@angular/core';
import { Meta, Title } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { JsonLdSchema, SeoConfig, SeoTag, OpenGraphConfig, TwitterConfig } from '@core/types/seo';
import { BRAND_NAME, SITE_URL } from '@core/constants';

@Injectable({
  providedIn: 'root'
})
export class SeoService {
  private readonly title = inject(Title);
  private readonly meta = inject(Meta);
  private readonly router = inject(Router);
  private readonly document = inject(DOCUMENT);
  private readonly translate = inject(TranslateService);
  private readonly platformId = inject(PLATFORM_ID);
  private readonly titleSuffix = ` | ${BRAND_NAME}`;
  private readonly jsonLdSelector = 'script[data-seo-json-ld="true"]';
  private readonly ogSelector = 'meta[data-seo-og="true"]';
  private readonly twitterSelector = 'meta[data-seo-twitter="true"]';

  private currentSeoConfig?: SeoConfig;
  private baseJsonLd: JsonLdSchema[] = [];

  applySeo(config: SeoConfig): void {
    this.currentSeoConfig = config;

    const title = config.titleKey
      ? this.translate.instant(config.titleKey)
      : config.title;

    const description = config.descriptionKey
      ? this.translate.instant(config.descriptionKey)
      : config.description;

    if (title) {
      this.setTitle(title);
    }

    if (description) {
      this.setDescription(description);
    }

    this.setTags(config.tags ?? []);
    this.setCanonical(config.canonicalPath);
    this.setHreflang(config.alternates);
    this.setRobots(config.robots);

    const pageSchemas = config.jsonLd
      ? (Array.isArray(config.jsonLd) ? config.jsonLd : [config.jsonLd])
      : [];

    for (const schema of pageSchemas) {
      if (title && !schema['name']) schema['name'] = title;
      if (description && !schema['description']) schema['description'] = description;
      if (schema['url'] && typeof schema['url'] === 'string') {
        schema['url'] = this.absoluteUrl(schema['url'] as string);
      }
    }

    const merged = this.deduplicateByType([...this.baseJsonLd, ...pageSchemas]);
    this.setJsonLd(merged);

    this.setOpenGraph({
      ...(title ? { title } : {}),
      ...(description ? { description } : {}),
      ...config.openGraph,
    });

    this.setTwitter({
      ...(title ? { title } : {}),
      ...(description ? { description } : {}),
      ...config.twitter,
    });
  }

  refreshSeo(): void {
    if (this.currentSeoConfig) {
      this.applySeo(this.currentSeoConfig);
    }
  }

  setTitle(title: string, useTemplate = true): void {
    const trimmedTitle = title.trim();
    const hasSuffix = trimmedTitle.includes(this.titleSuffix);
    const nextTitle = useTemplate && !hasSuffix
      ? `${trimmedTitle}${this.titleSuffix}`
      : trimmedTitle;

    this.title.setTitle(nextTitle);
  }

  setDescription(description: string): void {
    this.meta.updateTag({ name: 'description', content: description });
  }

  setTags(tags: SeoTag[]): void {
    for (const tag of tags) {
      if (tag.name) {
        this.meta.updateTag({ name: tag.name, content: tag.content });
      }

      if (tag.property) {
        this.meta.updateTag({ property: tag.property, content: tag.content });
      }
    }
  }

  setCanonical(path?: string): void {
    const href = this.absoluteUrl(path ?? this.router.url);
    let canonical = this.document.querySelector<HTMLLinkElement>('link[rel="canonical"]');

    if (!canonical) {
      canonical = this.document.createElement('link');
      canonical.setAttribute('rel', 'canonical');
      this.document.head.appendChild(canonical);
    }

    canonical.setAttribute('href', href);
  }

  setHreflang(alternates?: Record<string, string>): void {
    const selector = 'link[rel="alternate"][hreflang]';
    this.document.querySelectorAll(selector).forEach(el => el.remove());
    if (!alternates) return;
    for (const [hreflang, href] of Object.entries(alternates)) {
      const link = this.document.createElement('link');
      link.setAttribute('rel', 'alternate');
      link.setAttribute('hreflang', hreflang);
      link.setAttribute('href', this.absoluteUrl(href));
      this.document.head.appendChild(link);
    }
  }

  setJsonLd(schemas: JsonLdSchema | JsonLdSchema[] | null): void {
    this.clearJsonLd();

    const normalized = Array.isArray(schemas)
      ? schemas
      : schemas
        ? [schemas]
        : [];

    for (const schema of normalized) {
      const script = this.document.createElement('script');
      script.type = 'application/ld+json';
      script.setAttribute('data-seo-json-ld', 'true');
      script.text = JSON.stringify(schema);
      this.document.head.appendChild(script);
    }
  }

  setBaseJsonLd(schemas: JsonLdSchema[] | null): void {
    this.baseJsonLd = schemas ?? [];
  }

  private deduplicateByType(schemas: JsonLdSchema[]): JsonLdSchema[] {
    const seen = new Set<string>();

    return schemas.filter(s => {
      const type = String(s['@type'] ?? '');
      if (!type || seen.has(type)) return false;
      seen.add(type);
      return true;
    });
  }

  clearJsonLd(): void {
    this.document.querySelectorAll(this.jsonLdSelector).forEach(script => script.remove());
  }

  absoluteUrl(path: string): string {
    if (/^https?:\/\//i.test(path)) {
      return path;
    }

    const origin = isPlatformBrowser(this.platformId)
      ? this.document.location.origin
      : SITE_URL;
    const normalizedPath = path.startsWith('/') ? path : `/${path}`;
    return `${origin}${normalizedPath}`;
  }

  private resolveOgValue(config: OpenGraphConfig | undefined, field: 'title' | 'description'): string | undefined {
    if (!config) return;

    const keyField = `${field}Key` as 'titleKey' | 'descriptionKey';
    return config[keyField]
      ? this.translate.instant(config[keyField])
      : config[field];
  }

  private setOpenGraph(config?: OpenGraphConfig): void {
    this.document.querySelectorAll(this.ogSelector).forEach(el => el.remove());

    if (!config) return;

    const title = this.resolveOgValue(config, 'title');
    const description = this.resolveOgValue(config, 'description');

    const image = config.image ? this.absoluteUrl(config.image) : undefined;

    const ogTags: Record<string, string | undefined | number> = {
      'og:title': title,
      'og:description': description,
      'og:image': image,
      'og:image:width': config.imageWidth,
      'og:image:height': config.imageHeight,
      'og:url': config.url,
      'og:type': config.type,
      'og:locale': config.locale,
      'og:site_name': config.siteName,
    };

    for (const [property, content] of Object.entries(ogTags)) {
      if (!content) continue;

      const meta = this.document.createElement('meta');
      meta.setAttribute('property', property);
      meta.setAttribute('content', String(content));
      meta.setAttribute('data-seo-og', 'true');
      this.document.head.appendChild(meta);
    }
  }

  private setTwitter(config?: TwitterConfig): void {
    this.document.querySelectorAll(this.twitterSelector).forEach(el => el.remove());

    if (!config) return;

    const title = config.titleKey
      ? this.translate.instant(config.titleKey)
      : config.title;

    const description = config.descriptionKey
      ? this.translate.instant(config.descriptionKey)
      : config.description;

    const twitterTags: Record<string, string | undefined> = {
      'twitter:card': config.card,
      'twitter:title': title,
      'twitter:description': description,
      'twitter:image': config.image,
    };

    for (const [name, content] of Object.entries(twitterTags)) {
      if (!content) continue;

      const meta = this.document.createElement('meta');
      meta.setAttribute('name', name);
      meta.setAttribute('content', content);
      meta.setAttribute('data-seo-twitter', 'true');
      this.document.head.appendChild(meta);
    }
  }

  private setRobots(robots?: string): void {
    if (robots) {
      this.meta.updateTag({ name: 'robots', content: robots });
      return;
    }

    this.meta.removeTag('name="robots"');
  }
}
