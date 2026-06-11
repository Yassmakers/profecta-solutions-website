import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import sharp from 'sharp';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.join(__dirname, '..');
const source = path.join(root, 'images', 'template', 'profectalogootje.png');

async function toSquarePng(input, size) {
  return sharp(input)
    .resize(size, size, { fit: 'contain', background: { r: 255, g: 255, b: 255, alpha: 1 } })
    .png()
    .toBuffer();
}

const favicon16 = await toSquarePng(source, 16);
const favicon32 = await toSquarePng(source, 32);
const favicon180 = await toSquarePng(source, 180);

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

console.log('Generated favicons from profectalogootje.png');
