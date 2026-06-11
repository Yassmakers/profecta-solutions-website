import fs from 'fs';
import path from 'path';
import sharp from 'sharp';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.join(__dirname, '..');

const projects = [
  {
    slug: 'flutter-habits',
    name: 'Flutter Habits',
    image: 'flutterhabits.png',
    bg: '#0b0e20',
    type: 'Webshop',
    cms: 'Shopify',
    branch: 'Cosmetica',
    title: 'Portfolio Profecta Solutions: Webshop Flutter Habits',
    description:
      'Bekijk hoe Flutter Habits online verkoopt met een conversiegerichte webshop, sterke productpresentatie en een premium uitstraling door Profecta Solutions.',
    intro:
      'Flutter Habits wilde een webshop die net zo verzorgd aanvoelt als hun producten. De focus lag op een premium uitstraling, duidelijke productpagina\'s en een soepele koopervaring op mobiel en desktop.',
    approach:
      'We ontwikkelden een conversiegerichte webshop met sterke visuele hiërarchie, duidelijke calls-to-action en een productstructuur die bezoekers snel naar de juiste items leidt. Technisch is de basis gelegd voor snelheid, betrouwbaarheid en verdere groei in online omzet.',
    result:
      'Flutter Habits beschikt nu over een webshop die professioneel oogt en verkoop ondersteunt. De merkbeleving sluit aan bij het product en bezoekers vinden sneller wat ze zoeken.',
  },
  {
    slug: 'usforyourevent',
    name: 'USFORYOUREVENT',
    image: 'usforyoureventmockup.png',
    bg: '#1a1a2e',
    type: 'Platform',
    cms: 'Maatwerk',
    branch: 'Events',
    title: 'Portfolio Profecta Solutions: Platform USFORYOUREVENT',
    description:
      'Ontdek het maatwerkplatform USFORYOUREVENT: een digitale oplossing die eventorganisatie eenvoudiger en professioneler maakt.',
    intro:
      'USFORYOUREVENT wilde een platform dat eventorganisatie overzichtelijk maakt voor zowel organisatoren als bezoekers. De uitdaging: veel informatie bundelen in een interface die snel en intuïtief werkt.',
    approach:
      'We bouwden een maatwerkplatform met een heldere structuur, moderne UI en flows die gebruikers begeleiden van ontdekking tot actie. Het ontwerp is gericht op vertrouwen, snelheid en schaalbaarheid.',
    result:
      'USFORYOUREVENT heeft nu een platform dat professioneel oogt en klaar is om verder te groeien met nieuwe functionaliteiten en gebruikers.',
  },
  {
    slug: 'plan-for-me',
    name: 'Plan For Me',
    image: 'planforme1de.png',
    bg: '#2285f9',
    type: 'App',
    cms: 'Maatwerk',
    branch: 'Productiviteit',
    title: 'Portfolio Profecta Solutions: App Plan For Me',
    description:
      'Bekijk Plan For Me: een maatwerk app-ervaring ontwikkeld door Profecta Solutions voor overzicht en planning.',
    intro:
      'Plan For Me vroeg om een digitale oplossing die planning overzichtelijk maakt en gebruikers helpt sneller keuzes te maken zonder onnodige complexiteit.',
    approach:
      'We ontwierpen een heldere app-interface met focus op gebruiksgemak, consistente componenten en een flow die direct duidelijk maakt wat de volgende stap is.',
    result:
      'Plan For Me heeft een moderne app-ervaring die klaar is voor verdere uitbreiding en professioneel aanvoelt voor eindgebruikers.',
  },
  {
    slug: 'yoshorts',
    name: 'YoShorts',
    image: 'yoshorts.nl.png',
    bg: '#0b0e20',
    type: 'Platform',
    cms: 'Maatwerk',
    branch: 'Media',
    title: 'Portfolio Profecta Solutions: Platform YoShorts',
    description:
      'Bekijk YoShorts: een platform voor short-form content, ontwikkeld door Profecta Solutions.',
    intro:
      'YoShorts wilde een platform dat content snel toegankelijk maakt en een moderne gebruikerservaring biedt op mobiel en desktop.',
    approach:
      'We bouwden een schaalbare frontend met een sterke visuele identiteit en een structuur die content centraal zet zonder afleiding.',
    result:
      'YoShorts heeft nu een platform dat professioneel oogt en klaar is om verder te groeien met nieuwe features.',
  },
  {
    slug: 'monleo-milano',
    name: 'Monleo Milano',
    image: 'monleomilanoprofec.png',
    bg: '#000000',
    type: 'Webshop',
    cms: 'Maatwerk',
    branch: 'Fashion',
    title: 'Portfolio Profecta Solutions: Webshop Monleo Milano',
    description:
      'Bekijk de webshop van Monleo Milano: premium presentatie en conversiegericht design door Profecta Solutions.',
    intro:
      'Monleo Milano zocht een online aanwezigheid die past bij een premium merk: stijlvol, overzichtelijk en gericht op conversie.',
    approach:
      'We ontwikkelden een webshop met sterke visuele storytelling, duidelijke productcategorieën en een koopervaring die vertrouwen uitstraalt.',
    result:
      'Monleo Milano heeft een webshop die de merkbeleving versterkt en bezoekers gericht naar aankoop leidt.',
  },
  {
    slug: 'zb-verandatje',
    name: 'ZB Verandatje',
    image: 'zbverandatje3.png',
    bg: '#2d5016',
    type: 'Website',
    cms: 'WordPress',
    branch: 'Horeca',
    title: 'Portfolio Profecta Solutions: Website ZB Verandatje',
    description:
      'Bekijk de website van ZB Verandatje: een heldere presentatie met lokale uitstraling door Profecta Solutions.',
    intro:
      'ZB Verandatje wilde een website die direct laat zien wie ze zijn, wat ze aanbieden en hoe bezoekers contact opnemen.',
    approach:
      'We bouwden een overzichtelijke website met duidelijke navigatie, sterke visuals en een mobielvriendelijke opzet.',
    result:
      'ZB Verandatje heeft nu een professionele website die vertrouwen wekt en bezoekers snel naar de juiste informatie leidt.',
  },
  {
    slug: 'slimme-agents',
    name: 'Slimme AI Agents',
    image: 'slimmeagents.png',
    bg: '#0b0e20',
    type: 'AI platform',
    cms: 'Maatwerk',
    branch: 'Automatisering',
    title: 'Portfolio Profecta Solutions: Slimme AI Agents',
    description:
      'Bekijk Slimme AI Agents: een AI-oplossing die processen automatiseert en teams ontlast.',
    intro:
      'Slimme AI Agents is ontwikkeld voor organisaties die routinetaken willen automatiseren en medewerkers willen ondersteunen met intelligente assistentie.',
    approach:
      'We combineerden een heldere interface met een robuuste technische basis, zodat gebruikers snel zien wat agents doen en hoe ze waarde toevoegen.',
    result:
      'Het platform maakt AI toegankelijk in de dagelijkse workflow en biedt een solide basis voor verdere automatisering.',
  },
  {
    slug: 'slimme-weboplossingen',
    name: 'Slimme Weboplossingen',
    image: 'slimmeweboplossingen.png',
    bg: '#2285f9',
    type: 'Website',
    cms: 'Maatwerk',
    branch: 'IT-diensten',
    title: 'Portfolio Profecta Solutions: Slimme Weboplossingen',
    description:
      'Bekijk Slimme Weboplossingen: een moderne website die diensten helder presenteert en vertrouwen opbouwt.',
    intro:
      'Slimme Weboplossingen wilde een website die complexe diensten eenvoudig uitlegt en direct vertrouwen opbouwt bij nieuwe bezoekers.',
    approach:
      'We ontwierpen een heldere structuur met sterke visuals, duidelijke proposities en calls-to-action op de juiste momenten.',
    result:
      'De website communiceert nu professioneel wat Slimme Weboplossingen doet en nodigt bezoekers uit om contact op te nemen.',
  },
  {
    slug: 'usforyourevent-app',
    name: 'USFORYOUREVENT App',
    image: 'usforyoureventapp.png',
    bg: '#1a1a2e',
    type: 'App',
    cms: 'Maatwerk',
    branch: 'Events',
    title: 'Portfolio Profecta Solutions: USFORYOUREVENT App',
    description:
      'Bekijk de USFORYOUREVENT app: maatwerk software voor eventbeheer en gebruikersinteractie.',
    intro:
      'Naast het platform wilde USFORYOUREVENT een app-ervaring die gebruikers onderweg helpt met de belangrijkste acties en informatie.',
    approach:
      'We ontwikkelden een app-interface die aansluit op het platform, met focus op snelheid, overzicht en een consistente merkbeleving.',
    result:
      'De app versterkt het ecosysteem van USFORYOUREVENT en maakt interactie met events eenvoudiger voor eindgebruikers.',
  },
];

function carouselArticle(project) {
  return `<article class="portfoliowrapper swiper-slide"><a class="portfoliocontent" href="portfolio/${project.slug}.html" title="Bekijk ${project.name}" style="background-color: ${project.bg};"><div class="portfoliofoto"><picture class="img-holder stretchimg-holder"><img src="includes/_Files/profecta/portfolio/${project.image}" width="999" height="819" alt="${project.name}" class="landscape"></picture></div><div class="portfolioinfo"><div class="portfolioinfotxt"><h3 class="ellipsis">${project.name}</h3></div></div></a></article>\n`;
}

function createPortfolioPage(project) {
  const templatePath = path.join(root, 'portfolio', 'knallert-market.html');
  let html = fs.readFileSync(templatePath, 'utf8');
  const url = `https://www.profecta-solutions.nl/portfolio/${project.slug}.html`;
  const imageUrl = `https://www.profecta-solutions.nl/includes/_Files/profecta/portfolio/${project.image}`;
  const introBlock = `<p>${project.intro}</p>`;

  html = html.replaceAll('knallert-market.html', `${project.slug}.html`);
  html = html.replaceAll('Knallert Market', project.name);
  html = html.replaceAll('Knallert market', project.name);
  html = html.replaceAll('KnallertMarket', project.name);
  html = html.replaceAll('Webshop van Knallert Market', project.title.replace('Portfolio Profecta Solutions: ', ''));
  html = html.replaceAll(
    'Bekijk hoe Knallert Market succes boekt met een webshop inclusief conversiegericht webdesign en strategische online marketing van Profecta Solutions.',
    project.description,
  );
  html = html.replaceAll('portfolio webdesign, portfolio webshop, portfolio online marketing', `${project.slug}, ${project.name.toLowerCase()}, profecta solutions portfolio`);
  html = html.replaceAll('https://www.profecta-solutions.nl/includes/_Files/afbeeldingen/Paginas/portfolio/Vink Bouw/website-vink.png', imageUrl);
  const heroImg = `<picture class="img-holder stretchimg-holder"><img src="../includes/_Files/profecta/portfolio/${project.image}" width="999" height="736" alt="${project.name}" title="${project.name}" class="landscape " fetchpriority="high"></picture>`;
  const imagePreload = `../includes/_Files/profecta/portfolio/${project.image}`;
  html = html.replace(
    /rel="preload" href="\.\.\/includes\/_Files\/resized\/Paginas\/portfolio\/knallert-market\/knallert-market-website-laptop-500\.webp"[\s\S]*?media="\(min-width: 501px\)">/,
    `rel="preload" href="${imagePreload}" as="image" type="image/png">`,
  );
  html = html.replace(
    /<div\r?\nclass="page-hero-portfolio-img">[\s\S]*?<\/picture><\/div><\/div><div\r?\nclass="bg-circles-wrapper/,
    `<div\nclass="page-hero-portfolio-img">\n${heroImg}</div></div><div\nclass="bg-circles-wrapper`,
  );
  html = html.replaceAll('Knaller Market website laptop', `${project.name} mockup`);

  html = html.replace(/<title>[^<]*<\/title>/, `<title>${project.title}</title>`);
  html = html.replace(/name="title" content="[^"]*"/, `name="title" content="${project.title}"`);
  html = html.replace(/property="og:title" content="[^"]*"/, `property="og:title" content="${project.title}"`);
  html = html.replace(/property="og:site_name" content="[^"]*"/, `property="og:site_name" content="${project.title}"`);
  html = html.replace(/property="og:description" content="[^"]*"/, `property="og:description" content="${project.description}"`);
  html = html.replace(/name="description" content="[^"]*"/, `name="description" content="${project.description}"`);
  html = html.replace(/rel="canonical" href="[^"]*"/, `rel="canonical" href="${url}"`);
  html = html.replace(/"url": "https:\\\/\\\/www\.profecta-solutions\.nl\\\/portfolio\\\/knallert-market\.html"/g, `"url": "${url.replace(/\//g, '\\/')}"`);
  html = html.replace(/"@id": "https:\\\/\\\/www\.profecta-solutions\.nl\\\/portfolio\\\/knallert-market\.html/g, `"@id": "${url.replace(/\//g, '\\/')}`);
  html = html.replace(/"name": "Portfolio Profecta Solutions: Webshop van Knallert Market"/, `"name": "${project.title}"`);
  html = html.replace(/"description": "Bekijk hoe Knallert Market[\s\S]*?Profecta Solutions\."/, `"description": "${project.description}"`);
  html = html.replace(/"thumbnailUrl": "[^"]*"/, `"thumbnailUrl": "${imageUrl}"`);
  html = html.replace(/"url": "https:\\\/\\\/www\.profecta-solutions\.nl\\\/includes\\\/_Files\\\/afbeeldingen\\\/Paginas\\\/portfolio\\\/Vink%20Bouw\\\/website-vink\.png"/, `"url": "${imageUrl.replace(/\//g, '\\/')}"`);

  html = html.replace(
    /class="page-hero-portfolio-info-row-item-label">Website type<\/p><p\r?\nclass="page-hero-portfolio-info-row-item-value">[^<]*<\/p>/,
    `class="page-hero-portfolio-info-row-item-label">Website type</p><p\nclass="page-hero-portfolio-info-row-item-value">${project.type}</p>`,
  );
  html = html.replace(
    /class="page-hero-portfolio-info-row-item-label">CMS<\/p><p\r?\nclass="page-hero-portfolio-info-row-item-value">[^<]*<\/p>/,
    `class="page-hero-portfolio-info-row-item-label">CMS</p><p\nclass="page-hero-portfolio-info-row-item-value">${project.cms}</p>`,
  );
  html = html.replace(
    /class="page-hero-portfolio-info-row-item-label">Branche<\/p>[\s\S]*?<\/div><\/div><\/div><div\r?\nclass="page-hero-img/,
    `class="page-hero-portfolio-info-row-item-label">Branche</p><p\nclass="page-hero-portfolio-info-row-item-value">${project.branch}</p></div></div></div><div\nclass="page-hero-img`,
  );

  html = html.replace(
    /class="page-hero-portfolio-txt-intro-desktop"><h2>De opdracht<\/h2>[\s\S]*?<\/div><\/div><div\r?\nclass="page-hero-portfolio-info-row"/,
    `class="page-hero-portfolio-txt-intro-desktop"><h2>De opdracht</h2>${introBlock}</div></div><div\nclass="page-hero-portfolio-info-row"`,
  );
  html = html.replace(
    /style="background: radial-gradient\(circle at center, #c5b367[\s\S]*?<\/div><\/div><\/div>\r?\n<\/section>/,
    `style="background: radial-gradient(circle at center, ${project.bg} 0%, ${project.bg}66 30%, ${project.bg}00 70%);"></div><div\nclass="bg-circle bg-circle-2 page-hero-bg-2" style="background: radial-gradient(circle at center, ${project.bg} 0%, ${project.bg}66 30%, ${project.bg}00 70%);"></div></div></div>\n</section>`,
  );

  html = html.replace(
    /<section\r?\nid="inhoud"[\s\S]*?<\/section>/,
    `<section id="inhoud" class="content-section-medium-top content-section-footer FadeInUp animate-this-element"><div class="content-section-full-wrapper"><div class="content-section-inner scale layout-content"><h2>De opdracht</h2>${introBlock}</div></div></section>`,
  );
  html = html.replace(
    /<section\r?\nid="portfolio-detail-1"[\s\S]*?<\/section>/,
    `<section id="portfolio-detail-1" class="content-section-medium-top content-section-footer"><div class="content-section-full-wrapper"><div class="content-section-inner scale layout-content FadeInUp animate-this-element"><h2>Zo hebben wij het aangepakt</h2><p>${project.approach}</p></div></div></section>`,
  );
  html = html.replace(
    /<section\r?\nid="porfolio-detail-results"[\s\S]*?<\/section>/,
    `<section id="porfolio-detail-results" class="content-section-medium-top content-section-footer"><div class="content-section-full-wrapper"><div class="content-section-inner scale content-section-text-only layout-content FadeInUp animate-this-element"><h2>Het resultaat</h2><p>${project.result}</p></div></div></section>`,
  );
  html = html.replace(/<section\r?\nclass="portfoliodetailreviewwrapper[\s\S]*?<\/section>/, '');
  html = html.replace(/<a\s+href="https:\/\/www\.knallertmarket[^"]*"[\s\S]*?<\/a>\s*/g, '');
  html = html.replace(/Daan de Leeuw/g, 'Profecta Solutions');

  fs.writeFileSync(path.join(root, 'portfolio', `${project.slug}.html`), html);
}

function prependProfectaCarousel(html, firstHref) {
  const profectaItems = projects.map((p) => carouselArticle(p).trim()).join('\n');
  const profectaPattern = new RegExp(
    `(${profectaItems.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}\\s*)+`,
    'g',
  );
  html = html.replace(profectaPattern, '');
  const escapedHref = firstHref.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  return html.replace(
    new RegExp(
      `(id="portfolio-highlights-full-wrapper"[\\s\\S]*?class="swiper-wrapper">\\r?\\n)(<article\\r?\\nclass="portfoliowrapper swiper-slide">\\r?\\n<a\\r?\\nclass="portfoliocontent" href="${escapedHref}")`,
    ),
    `$1${profectaItems}\n$2`,
  );
}

// index.html carousel prepend
const indexPath = path.join(root, 'index.html');
let indexHtml = fs.readFileSync(indexPath, 'utf8');
const indexUpdated = prependProfectaCarousel(indexHtml, 'portfolio/safety-marks.html');
if (indexUpdated !== indexHtml) {
  fs.writeFileSync(indexPath, indexUpdated);
  console.log('updated index.html carousel');
} else if (!indexHtml.includes('portfolio/flutter-habits.html')) {
  console.warn('index.html carousel update failed - check markup');
}

// webdesignbureau.html carousel
const webdesignPath = path.join(root, 'webdesignbureau.html');
let webdesignHtml = fs.readFileSync(webdesignPath, 'utf8');
const webdesignUpdated = prependProfectaCarousel(webdesignHtml, 'portfolio/steuer.html');
if (webdesignUpdated !== webdesignHtml) {
  fs.writeFileSync(webdesignPath, webdesignUpdated);
  console.log('updated webdesignbureau.html carousel');
} else if (!webdesignHtml.includes('portfolio/flutter-habits.html')) {
  console.warn('webdesignbureau.html carousel update failed - check markup');
}

for (const project of projects) {
  createPortfolioPage(project);
  console.log('created', project.slug);
}

// seo-voor-ai-belangrijk from technische-seo-fundering.svg
const svgSource = path.join(root, 'includes/_Files/afbeeldingen/Paginas/SEO-zoekmachine-optimalisatie/technische-seo-fundering.svg');
const outDir = path.join(root, 'includes/_Files/resized/Paginas/AI applicaties');
const ratio = 640 / 351;
const base = 'seo-voor-ai-belangrijk';
fs.mkdirSync(outDir, { recursive: true });
for (const w of [999, 750, 500, 555]) {
  const h = Math.round(w / ratio);
  const img = sharp(svgSource).resize(w, h, { fit: 'cover', position: 'centre' });
  await img.clone().webp({ quality: 85 }).toFile(path.join(outDir, `${base}-${w}.webp`));
  await img.clone().png().toFile(path.join(outDir, `${base}-${w}.png`));
  console.log('seo image', w, h);
}

console.log('done');
