/**
 * SEO audit voor lokale landing pages.
 * Controleert indexeerbaarheid, meta-tags, interne links en JSON-LD.
 */
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import * as cheerio from 'cheerio';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.join(__dirname, '..');
const DOMAIN = 'https://www.profecta-solutions.nl';

const cityPages = fs.readdirSync(root).filter((f) => /^website-maken-.*\.html$/.test(f));
const allHtml = [];

function walk(dir, prefix = '') {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    if (entry.name.startsWith('.') || entry.name === 'node_modules') continue;
    const rel = prefix ? `${prefix}/${entry.name}` : entry.name;
    const abs = path.join(dir, entry.name);
    if (entry.isDirectory()) walk(abs, rel);
    else if (entry.name.endsWith('.html')) allHtml.push(rel.replace(/\\/g, '/'));
  }
}
walk(root);

const linkCounts = Object.fromEntries(cityPages.map((p) => [p, 0]));
const issues = [];

function auditPage(rel) {
  const abs = path.join(root, rel);
  const html = fs.readFileSync(abs, 'utf8');
  const $ = cheerio.load(html);
  const title = $('title').text().trim();
  const desc = $('meta[name="description"]').attr('content') || '';
  const robots = $('meta[name="robots"]').attr('content') || 'index, follow';
  const canonical = $('link[rel="canonical"]').attr('href') || '';
  const h1 = $('h1').first().text().trim();
  const jsonLd = $('script[type="application/ld+json"]');
  let ldValid = 0;
  jsonLd.each((_, el) => {
    try {
      JSON.parse($(el).html() || '');
      ldValid++;
    } catch {
      issues.push(`${rel}: ongeldige JSON-LD`);
    }
  });

  $('a[href]').each((_, el) => {
    const href = $(el).attr('href') || '';
    for (const cp of cityPages) {
      if (href === cp || href.endsWith(`/${cp}`)) linkCounts[cp]++;
    }
  });

  if (robots.includes('noindex')) issues.push(`${rel}: noindex gevonden`);
  if (!title) issues.push(`${rel}: geen title`);
  if (!desc) issues.push(`${rel}: geen meta description`);
  if (!canonical) issues.push(`${rel}: geen canonical`);
  if (!h1) issues.push(`${rel}: geen H1`);

  return { title, desc, canonical, h1, ldBlocks: jsonLd.length, ldValid };
}

console.log('=== SEO AUDIT – Lokale stadspagina\'s ===\n');

for (const page of cityPages.sort()) {
  const r = auditPage(page);
  const city = page.replace('website-maken-', '').replace('.html', '');
  console.log(`${page}`);
  console.log(`  title: ${r.title}`);
  console.log(`  h1: ${r.h1}`);
  console.log(`  canonical: ${r.canonical}`);
  console.log(`  json-ld: ${r.ldValid}/${r.ldBlocks} geldig`);
  console.log(`  interne links vanaf hele site: ${linkCounts[page]}`);
  console.log('');
}

const homepage = auditPage('index.html');
const homepageHtml = fs.readFileSync(path.join(root, 'index.html'), 'utf8');
const homepageLinksAlmere = (homepageHtml.match(/website-maken-almere\.html/g) || []).length;
const sitemap = fs.readFileSync(path.join(root, 'sitemap.xml'), 'utf8');
const inSitemap = sitemap.includes('website-maken-almere.html');

console.log('=== HOMEPAGE ===');
console.log(`  json-ld blocks: ${homepage.ldBlocks}`);
console.log(`  directe links naar website-maken-almere.html: ${homepageLinksAlmere}`);
console.log(`  LocalBusiness address in schema: ${homepageHtml.includes('"addressLocality": "Almere"') ? 'ja' : 'nee'}`);
console.log(`  aggregateRating in schema: ${homepageHtml.includes('aggregateRating') ? 'ja' : 'nee'}`);
console.log('');

console.log('=== SITEMAP ===');
console.log(`  website-maken-almere.html in sitemap: ${inSitemap ? 'ja' : 'NEE'}`);
console.log(`  lastmod aanwezig: ${sitemap.includes('<lastmod>') ? 'ja' : 'nee'}`);
console.log('');

console.log('=== INDEXERING (handmatig checken) ===');
console.log(`  Google: site:profecta-solutions.nl website-maken-almere`);
console.log(`  Search Console: URL inspectie → ${DOMAIN}/website-maken-almere.html`);
console.log('');

if (issues.length) {
  console.log(`⚠ ${issues.length} issues:`);
  for (const i of issues.slice(0, 20)) console.log(`  - ${i}`);
} else {
  console.log('✓ Geen kritieke on-page issues gevonden.');
}

console.log('\n=== AANBEVELING ===');
if (linkCounts['website-maken-almere.html'] < 5) {
  console.log('  Weinig interne links naar Almere-pagina. Google vindt de pagina traag.');
}
console.log('  1. Google Search Console → URL inspectie → Indexering aanvragen');
console.log('  2. Sitemap opnieuw indienen in Search Console');
console.log('  3. Google Business Profile: categorie "Webdesign bureau", Almere als locatie');
console.log('  4. Wacht 1-4 weken – nieuwe pagina\'s indexeren niet meteen');
