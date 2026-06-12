import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.join(__dirname, '..');
const DOMAIN = 'https://www.profecta-solutions.nl';
const today = new Date().toISOString().slice(0, 10);

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

const exclude = new Set(['bedankt.html', 'zoekresultaten.html', '404.html']);

const homeBaseCities = new Set([
  'website-maken-almere.html',
  'website-maken-amsterdam.html',
  'app-maken-almere.html',
  'app-maken-amsterdam.html',
]);

function priorityFor(rel) {
  if (rel === 'index.html') return '1.0';
  if (rel === 'website-maken-nederland.html') return '0.98';
  if (homeBaseCities.has(rel)) return '0.95';
  if (/^website-maken-|^app-maken-/.test(rel)) return '0.85';
  if (/^(website-laten-maken|webshop-laten-maken|ai-applicaties|online-marketing|webdesignbureau)\.html$/.test(rel)) return '0.9';
  if (rel === 'portfolio.html') return '0.8';
  if (rel.startsWith('portfolio/')) return '0.6';
  if (rel.startsWith('blog/') || rel.startsWith('kennisbank/') || rel.startsWith('begrippen/')) return '0.6';
  return '0.7';
}

function lastmodFor(rel, absPath) {
  if (homeBaseCities.has(rel) || /^website-maken-|^app-maken-/.test(rel)) return today;
  try {
    return fs.statSync(absPath).mtime.toISOString().slice(0, 10);
  } catch {
    return today;
  }
}

const urls = [];
const seen = new Set();
for (const dir of contentDirs) {
  const absDir = path.join(root, dir);
  if (!fs.existsSync(absDir)) continue;
  for (const file of fs.readdirSync(absDir)) {
    if (!file.endsWith('.html')) continue;
    if (exclude.has(file)) continue;
    const rel = dir === '.' ? file : `${dir}/${file}`;
    if (seen.has(rel)) continue;
    seen.add(rel);
    const absPath = path.join(absDir, file);
    const loc = rel === 'index.html' ? `${DOMAIN}/` : `${DOMAIN}/${rel}`;
    urls.push({ loc, priority: priorityFor(rel), lastmod: lastmodFor(rel, absPath) });
  }
}

urls.sort((a, b) => {
  if (a.loc === `${DOMAIN}/`) return -1;
  if (b.loc === `${DOMAIN}/`) return 1;
  if (a.priority !== b.priority) return Number(b.priority) - Number(a.priority);
  return a.loc.localeCompare(b.loc);
});

const body = urls
  .map(
    (u) =>
      `  <url>\n    <loc>${u.loc}</loc>\n    <lastmod>${u.lastmod}</lastmod>\n    <changefreq>weekly</changefreq>\n    <priority>${u.priority}</priority>\n  </url>`,
  )
  .join('\n');

const xml = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${body}\n</urlset>\n`;
fs.writeFileSync(path.join(root, 'sitemap.xml'), xml);
console.log(`sitemap.xml geschreven met ${urls.length} URLs (lastmod: ${today} voor stadspagina's)`);
