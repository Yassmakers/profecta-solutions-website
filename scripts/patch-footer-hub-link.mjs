/**
 * Voegt footer-link "Website maken per stad" toe op alle pagina's.
 * Dit geeft elke stadspagina honderden interne links via de hub.
 */
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const root = path.join(path.dirname(fileURLToPath(import.meta.url)), '..');

function hubHref(relPath) {
  const depth = relPath.split('/').length - 1;
  return `${depth ? '../'.repeat(depth) : ''}website-maken-nederland.html`;
}

function hubLink(href) {
  return `<li
class='submenu-li'>
<a
href="${href}" class="">
<span
class='menulabel'>Website maken per stad</span><span
class='menulabel-hover' aria-hidden='true'>Website maken per stad</span>
</a></li>`;
}

const htmlFiles = [];
function walk(dir, prefix = '') {
  for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
    if (e.name.startsWith('.') || e.name === 'node_modules') continue;
    const rel = prefix ? `${prefix}/${e.name}` : e.name;
    const abs = path.join(dir, e.name);
    if (e.isDirectory()) walk(abs, rel);
    else if (e.name.endsWith('.html') && e.name !== 'website-maken-nederland.html') htmlFiles.push(rel.replace(/\\/g, '/'));
  }
}
walk(root);

let changed = 0;
for (const rel of htmlFiles) {
  const p = path.join(root, rel);
  let html = fs.readFileSync(p, 'utf8');
  if (html.includes('Website maken per stad</span>')) continue;
  if (!html.includes('snel-navigeren-footer')) continue;

  const href = hubHref(rel);
  const link = hubLink(href);

  const marker = `class='menulabel'>Website laten maken</span>`;
  const idx = html.indexOf(marker);
  if (idx === -1) continue;

  const end = html.indexOf('</a></li>', idx);
  if (end === -1) continue;

  html = html.slice(0, end + 9) + link + html.slice(end + 9);
  fs.writeFileSync(p, html);
  changed++;
}

console.log(`Footer hub-link toegevoegd op ${changed} pagina's.`);
