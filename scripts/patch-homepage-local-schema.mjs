/**
 * Vult homepage JSON-LD met alle stadspagina's (ItemList + hasOfferCatalog).
 */
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.join(__dirname, '..');
const DOMAIN = 'https://www.profecta-solutions.nl';

const data = JSON.parse(fs.readFileSync(path.join(__dirname, 'local-seo-pages.json'), 'utf8'));
const cities = data.cities;

const offers = cities.flatMap((c) => [
  {
    '@type': 'Offer',
    itemOffered: {
      '@type': 'Service',
      name: `Website maken ${c.name}`,
      url: `${DOMAIN}/website-maken-${c.slug}.html`,
    },
  },
  {
    '@type': 'Offer',
    itemOffered: {
      '@type': 'Service',
      name: `App laten maken ${c.name}`,
      url: `${DOMAIN}/app-maken-${c.slug}.html`,
    },
  },
]);

const itemList = cities.flatMap((c, i) => [
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

const offerCatalogJson = JSON.stringify(offers, null, 16).replace(/\n/g, '\n                ');
const itemListJson = JSON.stringify(itemList, null, 16).replace(/\n/g, '\n                ');

let html = fs.readFileSync(path.join(root, 'index.html'), 'utf8');

html = html.replace(
  /"hasOfferCatalog": \{[\s\S]*?"itemListElement": \[[\s\S]*?\]\s*\}/,
  `"hasOfferCatalog": {
                "@type": "OfferCatalog",
                "name": "Website en app diensten per regio",
                "itemListElement": ${offerCatalogJson}
            }`,
);

html = html.replace(
  /"@type": "ItemList"[\s\S]*?"itemListElement": \[[\s\S]*?\]\s*\}/,
  `"@type": "ItemList",
            "@id": "${DOMAIN}/#local-seo-pages",
            "name": "Website maken per stad",
            "numberOfItems": ${itemList.length},
            "itemListElement": ${itemListJson}
        }`,
);

fs.writeFileSync(path.join(root, 'index.html'), html);
console.log(`Homepage schema bijgewerkt: ${cities.length} steden (${itemList.length} URLs in ItemList).`);
