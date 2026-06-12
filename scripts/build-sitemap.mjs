import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.join(__dirname, '..');
const DOMAIN = 'https://www.profecta-solutions.nl';

// Mappen met indexeerbare content
const contentDirs = [
  '.',
  'portfolio',
  'blog',
  'kennisbank',
  'begrippen',
  'vacatures',
  'webhosting',
  'microsoft-365-business',
  'fotografie-en-videografie',
  'online-marketing',
  'online-marketing/analytics',
  'online-marketing/conversie-optimalisatie',
  'online-marketing/seo-uitbesteden',
  'online-marketing/social-media',
  'online-marketing/zoekmachine-adverteren',
  'online-marketing/zoekmachine-optimalisatie',
];

// Niet opnemen in sitemap
const exclude = new Set(['bedankt.html', 'zoekresultaten.html', '404.html']);

function priorityFor(rel) {
  if (rel === 'index.html') return '1.0';
  if (/^website-maken-|^app-maken-/.test(rel)) return '0.8';
  if (/^(website-laten-maken|webshop-laten-maken|ai-applicaties|online-marketing|webdesignbureau)\.html$/.test(rel)) return '0.9';
  if (rel === 'portfolio.html') return '0.8';
  if (rel.startsWith('portfolio/')) return '0.6';
  if (rel.startsWith('blog/') || rel.startsWith('kennisbank/') || rel.startsWith('begrippen/')) return '0.6';
  return '0.7';
}

const urls = [];
const seen = new Set();
for (const dir of contentDirs) {
  const abs = path.join(root, dir);
  if (!fs.existsSync(abs)) continue;
  for (const file of fs.readdirSync(abs)) {
    if (!file.endsWith('.html')) continue;
    if (exclude.has(file)) continue;
    const rel = dir === '.' ? file : `${dir}/${file}`;
    if (seen.has(rel)) continue;
    seen.add(rel);
    const loc = rel === 'index.html' ? `${DOMAIN}/` : `${DOMAIN}/${rel}`;
    urls.push({ loc, priority: priorityFor(rel) });
  }
}

// index.html eerst, daarna op prioriteit (hoog -> laag), daarna alfabetisch
urls.sort((a, b) => {
  if (a.loc === `${DOMAIN}/`) return -1;
  if (b.loc === `${DOMAIN}/`) return 1;
  if (a.priority !== b.priority) return Number(b.priority) - Number(a.priority);
  return a.loc.localeCompare(b.loc);
});

const body = urls
  .map(
    (u) => `  <url>\n    <loc>${u.loc}</loc>\n    <changefreq>weekly</changefreq>\n    <priority>${u.priority}</priority>\n  </url>`,
  )
  .join('\n');

const xml = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${body}\n</urlset>\n`;
fs.writeFileSync(path.join(root, 'sitemap.xml'), xml);
console.log(`sitemap.xml geschreven met ${urls.length} URLs`);
