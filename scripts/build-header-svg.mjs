import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import sharp from 'sharp';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.join(__dirname, '..');
const sourceSvg = path.join(root, 'svglogo.svg');
const outputSvg = path.join(root, 'images', 'template', 'profecta-header.svg');

const preview = await sharp(sourceSvg, { density: 144 })
  .resize(720, null)
  .png()
  .toBuffer();

const { data, info } = await sharp(preview).ensureAlpha().raw().toBuffer({ resolveWithObject: true });
const { width, height, channels } = info;
let minX = width;
let minY = height;
let maxX = 0;
let maxY = 0;
const limitY = Math.floor(height * 0.42);

for (let y = 0; y < limitY; y++) {
  for (let x = 0; x < width; x++) {
    const alpha = data[(y * width + x) * channels + 3];
    if (alpha > 20) {
      minX = Math.min(minX, x);
      minY = Math.min(minY, y);
      maxX = Math.max(maxX, x);
      maxY = Math.max(maxY, y);
    }
  }
}

const pad = Math.round((maxX - minX) * 0.1);
const scale = 1440 / width;
const viewBox = [
  Math.max(0, Math.floor((minX - pad) * scale)),
  Math.max(0, Math.floor((minY - pad) * scale)),
  Math.ceil((maxX - minX + pad * 2) * scale),
  Math.ceil((maxY - minY + pad * 2) * scale),
].join(' ');

let svg = fs.readFileSync(sourceSvg, 'utf8');
svg = svg
  .replace(/viewBox="[^"]+"/, `viewBox="${viewBox}"`)
  .replace(/\s+width="[^"]+"/, '')
  .replace(/\s+height="[^"]+"/, '');

fs.writeFileSync(outputSvg, svg);
console.log(`profecta-header.svg viewBox="${viewBox}"`);
