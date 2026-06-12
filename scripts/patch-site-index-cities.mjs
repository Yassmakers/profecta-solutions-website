import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.join(__dirname, '..');

const data = JSON.parse(fs.readFileSync(path.join(__dirname, 'local-seo-pages.json'), 'utf8'));
const cities = data.cities;

const START = '<!-- local-seo-cities:start -->';
const END = '<!-- local-seo-cities:end -->';

const websiteLinks = cities
  .map((c) => `<li><a href="website-maken-${c.slug}.html">Website maken ${c.name}</a></li>`)
  .join('');
const appLinks = cities
  .map((c) => `<li><a href="app-maken-${c.slug}.html">App laten maken ${c.name}</a></li>`)
  .join('');

const block = `${START}<section id="local-seo-cities" class="content-section-medium-top content-section-footer"><div class="content-section-full-wrapper"><div class="content-section-inner scale layout-content"><h2>Website maken per stad</h2><ul class="site-index">${websiteLinks}</ul><h2>App laten maken per stad</h2><ul class="site-index">${appLinks}</ul></div></div></section>${END}`;

let html = fs.readFileSync(path.join(root, 'site-index.html'), 'utf8');

const re = new RegExp(`${START}[\\s\\S]*?${END}`);
if (re.test(html)) {
  html = html.replace(re, block);
} else {
  // injecteer net voor afsluitende </main>
  html = html.replace(/<\/main>/, `${block}\n</main>`);
}

fs.writeFileSync(path.join(root, 'site-index.html'), html);
console.log(`site-index.html bijgewerkt met ${cities.length} steden (website + app links).`);
