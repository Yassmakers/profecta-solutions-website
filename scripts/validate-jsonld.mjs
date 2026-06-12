import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const root = path.join(path.dirname(fileURLToPath(import.meta.url)), '..');
const files = fs.readdirSync(root).filter((f) => /^(website|app)-maken-.*\.html$/.test(f));

let totalBad = 0;
for (const f of files) {
  const h = fs.readFileSync(path.join(root, f), 'utf8');
  const blocks = h.match(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/g) || [];
  let bad = 0;
  for (const b of blocks) {
    const json = b.replace(/<script[^>]*>/, '').replace(/<\/script>/, '');
    try {
      JSON.parse(json);
    } catch (e) {
      bad++;
      totalBad++;
      console.log('INVALID', f, '-', e.message.slice(0, 80));
    }
  }
}
console.log(`\nGecontroleerd: ${files.length} bestanden. Ongeldige JSON-LD blokken: ${totalBad}`);
