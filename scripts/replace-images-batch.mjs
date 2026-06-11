import fs from 'fs';
import path from 'path';
import sharp from 'sharp';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.join(__dirname, '..');

async function resizeSet(source, outDir, base, widths, ratio, fit = 'cover') {
  fs.mkdirSync(outDir, { recursive: true });
  for (const w of widths) {
    const h = Math.round(w / ratio);
    const img = sharp(source).resize(w, h, { fit, position: 'centre' });
    await img.clone().webp({ quality: 85 }).toFile(path.join(outDir, `${base}-${w}.webp`));
    await img.clone().png().toFile(path.join(outDir, `${base}-${w}.png`));
    console.log('generated', `${base}-${w}`, `${w}x${h}`);
  }
}

// 1. Profecta Solutions-back-end-developer from opmaatgemaakt.jpg
await resizeSet(
  path.join(root, 'assets/images/background/opmaatgemaakt.jpg'),
  path.join(root, 'includes/_Files/resized/fotos'),
  'Profecta Solutions-back-end-developer',
  [999, 750, 500],
  997 / 1327,
);

// 2. Profecta-CMS from noheadache.jpg
const cmsOut = path.join(root, 'includes/_Files/resized/Paginas/Website');
await resizeSet(
  path.join(root, 'assets/images/background/noheadache.jpg'),
  cmsOut,
  'Profecta-CMS',
  [641],
  641 / 400,
);
await sharp(path.join(root, 'assets/images/background/noheadache.jpg'))
  .resize(641, 400, { fit: 'cover', position: 'centre' })
  .jpeg({ quality: 88 })
  .toFile(path.join(root, 'includes/_Files/afbeeldingen/Paginas/Website/Profecta-CMS.jpg'));
console.log('generated Profecta-CMS.jpg');

// 3. seo-voor-ai-belangrijk from same developer photo
await resizeSet(
  path.join(root, 'assets/images/background/opmaatgemaakt.jpg'),
  path.join(root, 'includes/_Files/resized/Paginas/AI applicaties'),
  'seo-voor-ai-belangrijk',
  [999, 750, 500, 555],
  960 / 1254,
);

// HTML: kantoor → Solutions back-end developer
const htmlFiles = [];
function walk(dir) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory() && entry.name !== 'node_modules') walk(full);
    else if (entry.isFile() && entry.name.endsWith('.html')) htmlFiles.push(full);
  }
}
walk(root);

for (const file of htmlFiles) {
  let html = fs.readFileSync(file, 'utf8');
  const before = html;
  html = html.replaceAll('Profecta-kantoor-back-end-developer', 'Profecta Solutions-back-end-developer');
  html = html.replaceAll(
    'width="999" height="665" alt="Back end developer bouwen" title="Back end developer bouwen" class="landscape "',
    'width="997" height="1327" alt="Back end developer bouwen" title="Back end developer bouwen" class="portrait "',
  );
  html = html.replaceAll(
    'includes/_Files/afbeeldingen/Paginas/Website/Profecta-CMS.svg',
    'includes/_Files/resized/Paginas/Website/Profecta-CMS-641.webp',
  );
  html = html.replaceAll('type="image/svg+xml" >\n<img\nsrc="includes/_Files/resized/Paginas/Website/Profecta-CMS-641.webp"', 'type="image/webp" >\n<source\nsrcset="includes/_Files/resized/Paginas/Website/Profecta-CMS-641.png" type="image/png" >\n<img\nsrc="includes/_Files/resized/Paginas/Website/Profecta-CMS-641.webp"');
  if (html !== before) {
    fs.writeFileSync(file, html);
    console.log('updated', path.relative(root, file));
  }
}

console.log('done');
