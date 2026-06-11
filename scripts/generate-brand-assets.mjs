import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import sharp from 'sharp';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.join(__dirname, '..');
const source = path.join(root, 'images', 'template', 'profectalogootje.png');
const templateDir = path.join(root, 'images', 'template');

async function detectIconBounds(imagePath) {
  const { data, info } = await sharp(imagePath).ensureAlpha().raw().toBuffer({ resolveWithObject: true });
  const { width, height, channels } = info;
  const xs = [];
  const ys = [];

  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      const i = (y * width + x) * channels;
      const r = data[i];
      const g = data[i + 1];
      const b = data[i + 2];
      const isCloudBlue = b > r + 15 && b > 120 && g > 100;
      if (isCloudBlue) {
        xs.push(x);
        ys.push(y);
      }
    }
  }

  xs.sort((a, b) => a - b);
  ys.sort((a, b) => a - b);
  const pick = (values, ratio) => values[Math.floor(values.length * ratio)];

  const minX = pick(xs, 0.02);
  const maxX = pick(xs, 0.98);
  const minY = pick(ys, 0.02);
  const maxY = pick(ys, 0.95);
  const pad = Math.round((maxX - minX) * 0.06);

  return {
    left: Math.max(0, minX - pad),
    top: Math.max(0, minY - pad),
    width: Math.min(width - Math.max(0, minX - pad), maxX - minX + 1 + pad * 2),
    height: Math.min(height - Math.max(0, minY - pad), maxY - minY + 1 + pad * 2),
  };
}

const crop = await detectIconBounds(source);
const cropped = await sharp(source).extract(crop).png().toBuffer();
const { width: w, height: h } = await sharp(cropped).metadata();
const pad = Math.max(w, h);

const iconSquare = await sharp(cropped)
  .extend({
    top: Math.floor((pad - h) / 2),
    bottom: Math.ceil((pad - h) / 2),
    left: Math.floor((pad - w) / 2),
    right: Math.ceil((pad - w) / 2),
    background: { r: 0, g: 0, b: 0, alpha: 0 },
  })
  .resize(512, 512)
  .png()
  .toBuffer();

await fs.promises.mkdir(templateDir, { recursive: true });
await sharp(iconSquare).toFile(path.join(templateDir, 'profecta-icon.png'));

const favicon32 = await sharp(iconSquare).resize(32, 32).png().toBuffer();
const favicon16 = await sharp(iconSquare).resize(16, 16).png().toBuffer();
const favicon180 = await sharp(iconSquare).resize(180, 180).png().toBuffer();

await sharp(favicon32).toFile(path.join(root, 'favicon-32x32.png'));
await sharp(favicon16).toFile(path.join(root, 'favicon-16x16.png'));
await sharp(favicon32).toFile(path.join(root, 'favicon.png'));
await sharp(favicon180).toFile(path.join(root, 'apple-touch-icon.png'));

let offset = 6 + 16 * 2;
const sizes = [favicon16.length, favicon32.length];
const icoHeader = Buffer.from([0, 0, 1, 0, 2, 0]);
const dirEntries = [16, 32].map((dim, i) => {
  const entry = Buffer.alloc(16);
  entry.writeUInt8(dim, 0);
  entry.writeUInt8(dim, 1);
  entry.writeUInt8(0, 2);
  entry.writeUInt8(0, 3);
  entry.writeUInt16LE(1, 4);
  entry.writeUInt16LE(32, 6);
  entry.writeUInt32LE(sizes[i], 8);
  entry.writeUInt32LE(offset, 12);
  offset += sizes[i];
  return entry;
});
await fs.promises.writeFile(
  path.join(root, 'favicon.ico'),
  Buffer.concat([icoHeader, ...dirEntries, favicon16, favicon32]),
);

const faviconSvg = `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32" role="img" aria-label="Profecta Solutions">
  <image href="data:image/png;base64,${favicon32.toString('base64')}" width="32" height="32"/>
</svg>
`;
await fs.promises.writeFile(path.join(root, 'favicon.svg'), faviconSvg);

console.log('Generated profecta-icon.png and favicons from logoprofecta.jpg');
