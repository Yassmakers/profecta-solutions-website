import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.join(__dirname, '..');

const AGG = '{"@type":"AggregateRating","ratingValue":"4.9","reviewCount":"31","bestRating":"5","worstRating":"1"}';

// Review-sterren worden door Google ALLEEN ondersteund op LocalBusiness-types
// (zoals ProfessionalService), niet op Service. Daarom plaatsen we de rating
// uitsluitend op de ProfessionalService-node, na het geo-blok.
const serviceWithRating = `"serviceType": "Webdesign en website ontwikkeling",\n            "aggregateRating": ${AGG},`;
const serviceClean = '"serviceType": "Webdesign en website ontwikkeling",';

const geoAnchor = '                "longitude": 5.2157\n            },';
const geoWithRating = `                "longitude": 5.2157\n            },\n            "aggregateRating": ${AGG},`;

const files = fs.readdirSync(root).filter((f) => /^website-maken-.*\.html$/.test(f));

let changed = 0;
for (const f of files) {
  const p = path.join(root, f);
  let html = fs.readFileSync(p, 'utf8');
  const before = html;

  // 1) Verwijder eventueel eerder toegevoegde rating op de Service-node
  if (html.includes(serviceWithRating)) {
    html = html.replace(serviceWithRating, serviceClean);
  }

  // 2) Zorg dat ProfessionalService de rating heeft (na geo-blok)
  if (!html.includes(geoWithRating) && html.includes(geoAnchor)) {
    html = html.replace(geoAnchor, geoWithRating);
  }

  if (html !== before) {
    fs.writeFileSync(p, html);
    changed++;
    console.log('fixed ->', f);
  }
}
console.log(`\nKlaar: ${changed} bestanden bijgewerkt (rating alleen op ProfessionalService).`);
