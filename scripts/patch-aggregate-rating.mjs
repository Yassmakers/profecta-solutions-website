import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.join(__dirname, '..');

const AGG = '{"@type":"AggregateRating","ratingValue":"4.9","reviewCount":"31","bestRating":"5","worstRating":"1"}';

// Anker 1: Service-node (constante serviceType-regel in de website-template)
const serviceAnchor = '"serviceType": "Webdesign en website ontwikkeling",';
const serviceReplace = `"serviceType": "Webdesign en website ontwikkeling",\n            "aggregateRating": ${AGG},`;

// Anker 2: ProfessionalService-node (na het geo-blok)
const geoAnchor = '                "longitude": 5.2157\n            },';
const geoReplace = `                "longitude": 5.2157\n            },\n            "aggregateRating": ${AGG},`;

const files = fs
  .readdirSync(root)
  .filter((f) => /^website-maken-.*\.html$/.test(f));

let patched = 0;
let skipped = 0;
for (const f of files) {
  const p = path.join(root, f);
  let html = fs.readFileSync(p, 'utf8');
  if (html.includes('"aggregateRating"')) {
    skipped++;
    continue;
  }
  let changed = false;
  if (html.includes(serviceAnchor)) {
    html = html.replace(serviceAnchor, serviceReplace);
    changed = true;
  }
  if (html.includes(geoAnchor)) {
    html = html.replace(geoAnchor, geoReplace);
    changed = true;
  }
  if (changed) {
    fs.writeFileSync(p, html);
    patched++;
    console.log('rating ->', f);
  } else {
    console.log('GEEN anker gevonden in', f);
  }
}
console.log(`\nKlaar: ${patched} gepatcht, ${skipped} al voorzien.`);
