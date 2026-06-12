/**
 * Voegt footer-link "Website maken Almere" toe op belangrijke pagina's
 * (direct onder "Website laten maken" in Snel navigeren).
 */
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const root = path.join(path.dirname(fileURLToPath(import.meta.url)), '..');

const anchor = `<li
class='submenu-li'>
<a
href="website-maken-almere.html" class="">
<span
class='menulabel'>Website maken Almere</span><span
class='menulabel-hover' aria-hidden='true'>Website maken Almere</span>
</a></li>`;

const variants = [
  {
    after: `href="website-laten-maken.html" class="">
<span
class='menulabel'>Website laten maken</span><span
class='menulabel-hover' aria-hidden='true'>Website laten maken</span>
</a></li>`,
  },
  {
    after: `href="website-laten-maken.html" class="active">
<span
class='menulabel'>Website laten maken</span><span
class='menulabel-hover' aria-hidden='true'>Website laten maken</span>
</a></li>`,
  },
];

const targets = [
  'website-laten-maken.html',
  'webdesignbureau.html',
  'over-ons.html',
  'contact.html',
  'adviesgesprek-aanvragen.html',
  'online-marketing/zoekmachine-optimalisatie.html',
];

let changed = 0;
for (const rel of targets) {
  const p = path.join(root, rel);
  if (!fs.existsSync(p)) continue;
  let html = fs.readFileSync(p, 'utf8');
  if (html.includes('href="website-maken-almere.html"')) continue;
  let updated = false;
  for (const { after } of variants) {
    if (html.includes(after)) {
      html = html.replace(after, `${after}${anchor}`);
      updated = true;
      break;
    }
  }
  if (!updated) continue;
  fs.writeFileSync(p, html);
  changed++;
  console.log('link toegevoegd ->', rel);
}
console.log(`\nKlaar: ${changed} pagina's bijgewerkt.`);
