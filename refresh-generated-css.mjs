/**
 * Downloads the real generated.css from designpro.nl.
 * Run this if the site layout looks broken (white hero text, missing menus, etc.)
 */
import fs from 'fs';
import path from 'path';
import https from 'https';
import { fileURLToPath } from 'url';

const ROOT = path.dirname(fileURLToPath(import.meta.url));
const OUT = path.join(ROOT, 'assets', 'css', 'generated', 'generated.css');
const URL = 'https://www.designpro.nl/assets/css/generated/generated.css?t=1780497548';

function fetch(url) {
  return new Promise((resolve, reject) => {
    https.get(url, { headers: { 'User-Agent': 'Mozilla/5.0' } }, (res) => {
      if ([301, 302, 307, 308].includes(res.statusCode) && res.headers.location) {
        res.resume();
        return resolve(fetch(res.headers.location));
      }
      if (res.statusCode !== 200) {
        res.resume();
        return reject(new Error(`HTTP ${res.statusCode}`));
      }
      const chunks = [];
      res.on('data', (c) => chunks.push(c));
      res.on('end', () => resolve(Buffer.concat(chunks)));
    }).on('error', reject);
  });
}

const buf = await fetch(URL);
const text = buf.toString('utf8');

if (!text.includes(':root{') || !text.includes('#websiteholder')) {
  throw new Error('Downloaded CSS does not look like designpro generated.css');
}

fs.mkdirSync(path.dirname(OUT), { recursive: true });
fs.writeFileSync(OUT, buf);
console.log(`Updated ${OUT} (${buf.length} bytes)`);
