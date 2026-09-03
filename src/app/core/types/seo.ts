export type JsonLdSchema = Record<string, unknown>;

export interface SeoTag {
  name?: string;
  property?: string;
  content: string;
}

export interface OpenGraphConfig {
  title?: string;
  description?: string;
  titleKey?: string;
  descriptionKey?: string;
  image?: string;
  imageWidth?: number;
  imageHeight?: number;
  url?: string;
  type?: string;
  locale?: string;
  siteName?: string;
}

export interface TwitterConfig {
  card?: 'summary' | 'summary_large_image';
  title?: string;
  description?: string;
  titleKey?: string;
  descriptionKey?: string;
  image?: string;
}

export interface SeoConfig {
  title?: string;
  description?: string;
  titleKey?: string;
  descriptionKey?: string;
  tags?: SeoTag[];
  canonicalPath?: string;
  alternates?: Record<string, string>;
  jsonLd?: JsonLdSchema | JsonLdSchema[] | null;
  robots?: string;
  openGraph?: OpenGraphConfig;
  twitter?: TwitterConfig;
}
