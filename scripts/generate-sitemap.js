const fs = require('fs');
const path = require('path');

const SITE_URL = 'https://hipermercadosuperior.com';

const scriptDir = __dirname;
const srcDir = path.join(scriptDir, '..', 'src');
const publicDir = path.join(scriptDir, '..', 'public');

const today = new Date().toISOString().split('T')[0];

function extractIds(filePath, pattern) {
  const content = fs.readFileSync(filePath, 'utf8');
  return [...content.matchAll(pattern)].map(m => m[1]);
}

const productIds = extractIds(
  path.join(srcDir, 'app/data/products.data.ts'),
  /id:\s*"([^"]+)"/g
);

const categoryIds = [
  ...new Set(
    extractIds(
      path.join(srcDir, 'app/data/categories.data.ts'),
      /id:\s*['"]([^'"]+)['"]/g
    )
  ),
];

// Single source of truth: read help.content.ts to avoid duplication
let helpCategories = [];
try {
  const helpContent = fs.readFileSync(path.join(srcDir, 'app/features/help/help.content.ts'), 'utf8');
  const catBlocks = [...helpContent.matchAll(/\{\s*id:\s*'([^']+)'\s*,\s*topics:\s*\[([^\]]+)\]/g)];
  helpCategories = catBlocks.map(m => {
    const catId = m[1];
    const topicsBlock = m[2];
    const topics = [...topicsBlock.matchAll(/id:\s*'([^']+)'/g)].map(tm => tm[1]);
    return { id: catId, topics };
  });
  if (helpCategories.length === 0) throw new Error('no categories parsed');
} catch (e) {
  // fallback to hardcoded (keeps build working if parse fails)
  helpCategories = [
    { id: 'orders', topics: ['track','cancel','address','late-delivery'] },
    { id: 'returns', topics: ['policy','damaged','refund'] },
    { id: 'account', topics: ['create','login','data','logout'] },
    { id: 'payments', topics: ['methods','pending','invoice'] },
    { id: 'products', topics: ['availability','offers','search'] },
    { id: 'stores', topics: ['contact','pickup'] },
    { id: 'other', topics: ['privacy','other'] },
  ];
}

const helpPages = [
  { loc: '/help', priority: '0.8', changefreq: 'weekly' },
  ...helpCategories.map(c => ({ loc: `/help/${c.id}`, priority: '0.6', changefreq: 'weekly' })),
  ...helpCategories.flatMap(c => c.topics.map(t => ({ loc: `/help/${c.id}/${t}`, priority: '0.5', changefreq: 'weekly' }))),
];

const staticPages = [
  { loc: '/',              priority: '1.0', changefreq: 'daily'   },
  { loc: '/offers',        priority: '0.8', changefreq: 'daily'   },
  { loc: '/contact',       priority: '0.5', changefreq: 'monthly' },
  { loc: '/legal/terms',   priority: '0.2', changefreq: 'yearly'  },
  { loc: '/legal/privacy', priority: '0.2', changefreq: 'yearly'  },
  ...helpPages,
];

const excluded = new Set(['/cart', '/search', '/not-found']);

function urlElement(urlPath, priority, changefreq) {
  return `  <url>
    <loc>${SITE_URL}${urlPath}</loc>
    <lastmod>${today}</lastmod>
    <changefreq>${changefreq}</changefreq>
    <priority>${priority}</priority>
  </url>`;
}

function buildSitemap() {
  const lines = [
    '<?xml version="1.0" encoding="UTF-8"?>',
    '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">',
  ];

  for (const page of staticPages) {
    if (!excluded.has(page.loc)) {
      lines.push(urlElement(page.loc, page.priority, page.changefreq));
    }
  }

  for (const id of categoryIds) {
    lines.push(urlElement(`/category/${id}`, '0.8', 'weekly'));
  }

  for (const id of productIds) {
    lines.push(urlElement(`/product/${id}`, '0.6', 'weekly'));
  }

  lines.push('</urlset>', '');

  return lines.join('\n');
}

const sitemap = buildSitemap();
fs.writeFileSync(path.join(publicDir, 'sitemap.xml'), sitemap, 'utf8');

const total = staticPages.length + categoryIds.length + productIds.length;
console.log(`Sitemap generated: ${publicDir}\\sitemap.xml`);
console.log(`  Static pages:  ${staticPages.length}`);
console.log(`  Categories:    ${categoryIds.length}`);
console.log(`  Products:      ${productIds.length}`);
console.log(`  Total URLs:    ${total}`);
