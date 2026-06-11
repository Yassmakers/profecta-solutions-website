import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

function walk(dir, files = []) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const entryPath = path.join(dir, entry.name);
    if (entry.isDirectory() && entry.name !== 'node_modules' && entry.name !== '.git') {
      walk(entryPath, files);
    } else if (entry.isFile() && entry.name.endsWith('.html')) {
      files.push(entryPath);
    }
  }
  return files;
}

const stars = `<i
class="fa-solid fa-star"></i>
<i
class="fa-solid fa-star"></i>
<i
class="fa-solid fa-star"></i>
<i
class="fa-solid fa-star"></i>
<i
class="fa-solid fa-star"></i>`;

function makeReview({ title, text, name, imgPrefix, href }) {
  return `<article
class="referencewrapper referencehighlights swiper-slide">
<a
class="referencecontent" title="Google review van ${name}" href="${href}" target="_blank" rel="noopener noreferrer"><div
class="referencetop"><div
class="starsholder">
${stars}</div></div><div
class="referencehighlightstxt"><h3 class="ellipsis">${title}</h3><p>${text}</p></div><div
class="referencecompanyinfo"><div
class="referencecompanyicon">
<img
src="${imgPrefix}images/template/google-icon.svg" alt="Google review" width="40" height="40"></div><div
class="referencecompanytxt"><h4 class="ellipsis">Google review</h4><p
class="ellipsis">${name}</p></div>
<img
src="${imgPrefix}images/template/google-icon.svg" alt="Google icon" width="18" height="18"></div><div
class="referencebg"></div>
</a>
</article>`;
}

const googleHref = 'https://www.google.com/maps/search/Profecta+Solutions+Almere/reviews';
const reviews = [
  {
    title: 'Een aanrader voor iedereen!',
    text: 'Derk en zijn team, mijn complimenten. Jullie waren snel klaar met de site. Jullie hebben ook met mij samen gedacht hoe de site het beste kon uitzien. Een aanrader voor iedereen!',
    name: 'Cengiz Guner',
  },
  {
    title: 'Indrukwekkende expertise en samenwerking',
    text: 'De heer Y. Messa heeft mij op voortreffelijke wijze bijgestaan met inhoudelijk consult in een complexe cli&euml;ntzaak. In een vakgebied waar gespecialiseerd maatwerk van apps en websites vaak moeilijk te vinden is, bood Profecta Solutions een indrukwekkende bundel kennis. Ik beveel zijn expertise van harte aan.',
    name: 'Djerho Tete',
  },
  {
    title: 'Zeer blij met Profecta Solutions',
    text: 'Was in het begin spannend, veel keuzes. Achteraf wel zeer blij met Profecta. Goede communicatie.',
    name: 'Imane El',
  },
];

const pattern =
  /<article\s+class="referencewrapper referencehighlights swiper-slide">\s*<a\s+class="referencecontent" title="Lees de volledige review van Little Joya"[\s\S]*?<\/article>\s*<article\s+class="referencewrapper referencehighlights swiper-slide">\s*<a\s+class="referencecontent" title="Lees de volledige review van Airco Inside"[\s\S]*?<\/article>\s*<article\s+class="referencewrapper referencehighlights swiper-slide">\s*<a\s+class="referencecontent" title="Lees de volledige review van Knallert market"[\s\S]*?<\/article>/;

const root = path.join(__dirname, '..');
const files = walk(root).filter((file) =>
  fs.readFileSync(file, 'utf8').includes('Lees de volledige review van Little Joya'),
);

let updated = 0;
for (const file of files) {
  const rel = path.relative(root, file).replace(/\\/g, '/');
  const depth = rel.split('/').length - 1;
  const imgPrefix = depth ? '../'.repeat(depth) : '';
  const replacement = reviews.map((review) => makeReview({ ...review, imgPrefix, href: googleHref })).join('\n');
  const content = fs.readFileSync(file, 'utf8');
  if (!pattern.test(content)) {
    console.log('skip', rel);
    continue;
  }
  fs.writeFileSync(file, content.replace(pattern, replacement));
  updated += 1;
  console.log('updated', rel);
}

console.log('total', updated);
