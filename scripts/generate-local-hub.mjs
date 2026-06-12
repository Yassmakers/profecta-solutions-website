/**
 * Genereert website-maken-nederland.html – hub voor alle stadspagina's.
 * Geeft Google één sterke pagina met links naar elke "website maken [stad]" URL.
 */
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.join(__dirname, '..');
const DOMAIN = 'https://www.profecta-solutions.nl';

const data = JSON.parse(fs.readFileSync(path.join(__dirname, 'local-seo-pages.json'), 'utf8'));
const cities = data.cities;

const esc = (s) => s.replace(/&/g, '&amp;');

const websiteList = cities
  .map((c) => `<li><a href="website-maken-${c.slug}.html"><span>Website maken ${esc(c.name)}</span></a></li>`)
  .join('');
const appList = cities
  .map((c) => `<li><a href="app-maken-${c.slug}.html"><span>App laten maken ${esc(c.name)}</span></a></li>`)
  .join('');

const itemListSchema = cities.flatMap((c, i) => [
  {
    '@type': 'ListItem',
    position: i * 2 + 1,
    name: `Website maken ${c.name}`,
    url: `${DOMAIN}/website-maken-${c.slug}.html`,
  },
  {
    '@type': 'ListItem',
    position: i * 2 + 2,
    name: `App laten maken ${c.name}`,
    url: `${DOMAIN}/app-maken-${c.slug}.html`,
  },
]);

const ldJson = {
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': 'WebPage',
      '@id': `${DOMAIN}/website-maken-nederland.html`,
      url: `${DOMAIN}/website-maken-nederland.html`,
      name: 'Website maken per stad in Nederland | Profecta Solutions',
      description:
        'Website laten maken in Amsterdam, Almere, Rotterdam, Utrecht en 16 andere steden. Profecta Solutions bouwt SEO-vriendelijke maatwerk websites in heel Nederland.',
      isPartOf: { '@id': `${DOMAIN}/#WebSite` },
      inLanguage: 'nl-NL',
    },
    {
      '@type': 'ItemList',
      name: 'Website en app maken per stad',
      numberOfItems: itemListSchema.length,
      itemListElement: itemListSchema,
    },
  ],
};

const template = fs.readFileSync(path.join(root, 'website-laten-maken.html'), 'utf8');
let html = template;

const url = `${DOMAIN}/website-maken-nederland.html`;
const urlEsc = url.replace(/\//g, '\\/');
const oldUrl = `${DOMAIN}/website-laten-maken.html`;
const oldUrlEsc = oldUrl.replace(/\//g, '\\/');

html = html.split(oldUrlEsc).join(urlEsc);
html = html.split(oldUrl).join(url);

html = html.replace(
  /<title>[^<]*<\/title>/,
  '<title>Website maken per stad in Nederland | Profecta Solutions</title>',
);
html = html.replace(
  /name="title" content="[^"]*"/,
  'name="title" content="Website maken per stad in Nederland | Profecta Solutions"',
);
html = html.replace(
  /property="og:title" content="[^"]*"/,
  'property="og:title" content="Website maken per stad in Nederland | Profecta Solutions"',
);
html = html.replace(
  /property="og:site_name" content="[^"]*"/,
  'property="og:site_name" content="Website maken per stad in Nederland | Profecta Solutions"',
);
html = html.replace(
  /name="keywords" content="[^"]*"/,
  `name="keywords" content="website maken nederland, website laten maken amsterdam, website maken almere, website maken rotterdam, website bureau nederland, webdesign per stad"`,
);
html = html.replace(
  /name="description" content="[^"]*"/,
  `name="description" content="Website laten maken in jouw stad? Profecta Solutions bouwt maatwerk websites in Amsterdam, Almere, Rotterdam, Utrecht en 16 andere steden. ★ 4.9 Google reviews."`,
);
html = html.replace(/rel="canonical" href="[^"]*"/, `rel="canonical" href="${url}"`);

const hubContent = `<section id="local-seo-hub" class="content-section-medium-top content-section-footer"><div class="content-section-full-wrapper"><div class="content-section-inner scale layout-content"><h1>Website maken per stad in Nederland</h1><p>Zoek je een bureau voor <strong>website maken</strong> in jouw stad? Profecta Solutions bouwt maatwerk websites met sterke SEO in heel Nederland. Kies jouw stad voor lokale informatie, aanpak en een gratis adviesgesprek.</p><h2>Website maken per stad</h2><ul class="site-index local-seo-hub-list">${websiteList}</ul><h2>App laten maken per stad</h2><ul class="site-index local-seo-hub-list">${appList}</ul><p><a class="meerinfoblok meerinfoblok-icon" href="adviesgesprek-aanvragen.html"><span>Gratis adviesgesprek</span></a></p></div></div></section>`;

html = html.replace(
  /<section\r?\nid="inhoud"/,
  `<script type="application/ld+json">${JSON.stringify(ldJson)}</script>${hubContent}<section\nid="inhoud"`,
);

html = html.replace(/class="active">\s*\n<span\s*\nclass='menulabel'>Website laten maken/g, "class=\"\">\n<span\nclass='menulabel'>Website laten maken");

fs.writeFileSync(path.join(root, 'website-maken-nederland.html'), html);
console.log(`website-maken-nederland.html gegenereerd (${cities.length} steden).`);
