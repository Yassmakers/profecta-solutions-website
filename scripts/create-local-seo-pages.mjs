import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.join(__dirname, '..');

const DOMAIN = 'https://www.profecta-solutions.nl';
const OG_IMAGE = `${DOMAIN}/includes/_Files/afbeeldingen/fotos/website-bouwen.jpg`;

// Echte Google-beoordeling van Profecta Solutions (zie homepage review-badge)
const RATING = { '@type': 'AggregateRating', ratingValue: '4.9', reviewCount: '31', bestRating: '5', worstRating: '1' };

/**
 * Steden waarvoor we lokale SEO-landingspagina's genereren.
 * Voeg hier simpelweg een object toe om een nieuwe stad te ondersteunen.
 */
const cities = [
  { slug: 'amsterdam', name: 'Amsterdam', adj: 'Amsterdamse', province: 'Noord-Holland', nearby: ['Amstelveen', 'Haarlem', 'Zaandam'], angle: 'In een competitieve markt als Amsterdam maakt een snelle, goed vindbare website het verschil tussen opvallen en verdwijnen.' },
  { slug: 'almere', name: 'Almere', adj: 'Almeerse', province: 'Flevoland', nearby: ['Lelystad', 'Huizen', 'Amsterdam'], homeBase: true, angle: 'Als bureau gevestigd in Almere kennen we de lokale markt en ondernemers in Flevoland van binnenuit.' },
  { slug: 'rotterdam', name: 'Rotterdam', adj: 'Rotterdamse', province: 'Zuid-Holland', nearby: ['Schiedam', 'Capelle aan den IJssel', 'Dordrecht'], angle: 'Rotterdam draait op ondernemerschap en daadkracht; dat vertalen we naar een website die meteen tot actie aanzet.' },
  { slug: 'den-haag', name: 'Den Haag', adj: 'Haagse', province: 'Zuid-Holland', nearby: ['Rijswijk', 'Delft', 'Zoetermeer'], angle: 'Of je nu een dienstverlener of lokale ondernemer in Den Haag bent: we bouwen een site die vertrouwen wekt en klanten oplevert.' },
  { slug: 'utrecht', name: 'Utrecht', adj: 'Utrechtse', province: 'Utrecht', nearby: ['Nieuwegein', 'Houten', 'Zeist'], angle: 'Centraal in het land en sterk in groei: in Utrecht helpen we ondernemers om online net zo zichtbaar te zijn als offline.' },
  { slug: 'eindhoven', name: 'Eindhoven', adj: 'Eindhovense', province: 'Noord-Brabant', nearby: ['Veldhoven', 'Helmond', 'Best'], angle: 'In de Brainport-regio Eindhoven verwachten klanten techniek die klopt; daarom leveren we snelle, technisch sterke websites.' },
  { slug: 'groningen', name: 'Groningen', adj: 'Groningse', province: 'Groningen', nearby: ['Haren', 'Assen', 'Winschoten'], angle: 'Voor ondernemers in Groningen bouwen we websites die opvallen in de regio en blijven hangen bij bezoekers.' },
  { slug: 'tilburg', name: 'Tilburg', adj: 'Tilburgse', province: 'Noord-Brabant', nearby: ['Goirle', 'Waalwijk', 'Oisterwijk'], angle: 'Tilburgse bedrijven groeien hard; wij zorgen dat je website die groei kan dragen en versnellen.' },
  { slug: 'breda', name: 'Breda', adj: 'Bredase', province: 'Noord-Brabant', nearby: ['Oosterhout', 'Etten-Leur', 'Prinsenbeek'], angle: 'In Breda combineren we een verzorgde uitstraling met sterke vindbaarheid, zodat lokale klanten je makkelijk vinden.' },
  { slug: 'nijmegen', name: 'Nijmegen', adj: 'Nijmeegse', province: 'Gelderland', nearby: ['Arnhem', 'Wijchen', 'Cuijk'], angle: 'Voor Nijmeegse ondernemers maken we websites met karakter die scoren op lokale zoektermen.' },
  { slug: 'haarlem', name: 'Haarlem', adj: 'Haarlemse', province: 'Noord-Holland', nearby: ['Heemstede', 'Bloemendaal', 'Hoofddorp'], angle: 'In Haarlem draait het om stijl en vertrouwen; dat laten we terugkomen in elk ontwerp dat we opleveren.' },
  { slug: 'arnhem', name: 'Arnhem', adj: 'Arnhemse', province: 'Gelderland', nearby: ['Velp', 'Oosterbeek', 'Nijmegen'], angle: 'Voor Arnhemse bedrijven bouwen we websites die de regio aanspreken en bezoekers omzetten in klanten.' },
  { slug: 'amersfoort', name: 'Amersfoort', adj: 'Amersfoortse', province: 'Utrecht', nearby: ['Leusden', 'Nijkerk', 'Soest'], angle: 'Centraal gelegen Amersfoort is ideaal om regionaal te groeien; je website is daarbij je belangrijkste uithangbord.' },
  { slug: 'zwolle', name: 'Zwolle', adj: 'Zwolse', province: 'Overijssel', nearby: ['Kampen', 'Hattem', 'Dalfsen'], angle: 'In Zwolle en omgeving helpen we ondernemers om online het verschil te maken met een heldere, snelle website.' },
  { slug: 'den-bosch', name: "'s-Hertogenbosch", adj: 'Bossche', province: 'Noord-Brabant', nearby: ['Vught', 'Rosmalen', 'Oss'], angle: 'Voor ondernemers in Den Bosch bouwen we websites die de Brabantse gastvrijheid uitstralen en klanten overtuigen.' },
  { slug: 'lelystad', name: 'Lelystad', adj: 'Lelystadse', province: 'Flevoland', nearby: ['Almere', 'Dronten', 'Zeewolde'], angle: 'Voor Lelystadse ondernemers, zoals springkussenverhuur Inter Jump, bouwen we websites die bovenaan in Google verschijnen.' },
  { slug: 'apeldoorn', name: 'Apeldoorn', adj: 'Apeldoornse', province: 'Gelderland', nearby: ['Deventer', 'Zutphen', 'Vaassen'], angle: 'In Apeldoorn maken we websites die rust en vertrouwen uitstralen en tegelijk goed scoren in Google.' },
  { slug: 'leiden', name: 'Leiden', adj: 'Leidse', province: 'Zuid-Holland', nearby: ['Leiderdorp', 'Oegstgeest', 'Voorschoten'], angle: 'Voor Leidse ondernemers bouwen we websites die kennis en kwaliteit uitstralen en lokaal goed vindbaar zijn.' },
  { slug: 'maastricht', name: 'Maastricht', adj: 'Maastrichtse', province: 'Limburg', nearby: ['Meerssen', 'Valkenburg', 'Sittard'], angle: 'In Maastricht combineren we een stijlvolle uitstraling met sterke lokale vindbaarheid in Limburg.' },
  { slug: 'zaandam', name: 'Zaandam', adj: 'Zaanse', province: 'Noord-Holland', nearby: ['Zaanstad', 'Wormerveer', 'Amsterdam'], angle: 'Voor Zaanse ondernemers bouwen we websites die lokaal opvallen en aansluiten op de regio Amsterdam.' },
];

// Steden die we onderling linken (interne linkstructuur)
const featuredSlugs = ['amsterdam', 'almere', 'rotterdam', 'den-haag', 'utrecht', 'eindhoven', 'groningen', 'lelystad'];
const featured = featuredSlugs.map((s) => cities.find((c) => c.slug === s)).filter(Boolean);

const esc = (s) => s.replace(/&/g, '&amp;');
const nearbyText = (c) => {
  const n = c.nearby;
  if (n.length <= 1) return n.join('');
  return `${n.slice(0, -1).join(', ')} en ${n[n.length - 1]}`;
};

function regionsSection(kind, selfSlug) {
  const prefix = kind === 'website' ? 'website-maken-' : 'app-maken-';
  const label = kind === 'website' ? 'website maken' : 'app laten maken';
  const h2 = kind === 'website' ? 'Website maken in jouw regio' : 'App laten maken in jouw regio';
  const links = featured
    .filter((c) => c.slug !== selfSlug)
    .map((c) => `<a href="${prefix}${c.slug}.html"><span>${label} in ${esc(c.name)}</span></a>`)
    .join(', ');
  return `<section id="local-seo-regions" class="content-section-medium-top content-section-footer"><div class="content-section-full-wrapper"><div class="content-section-inner scale layout-content"><h2>${h2}</h2><p>We werken voor ondernemers in heel Nederland. Bekijk ook ${links}. Op elke pagina lees je hoe we lokaal scoren in Google en wat je kunt verwachten qua aanpak en oplevering. Alle steden staan op ons <a href="website-maken-nederland.html"><span>overzicht website maken per stad</span></a>.</p></div></div></section>`;
}

function allCitiesSection(kind, selfSlug) {
  const prefix = kind === 'website' ? 'website-maken-' : 'app-maken-';
  const label = kind === 'website' ? 'Website maken' : 'App laten maken';
  const h2 = kind === 'website' ? 'Website maken in elke stad' : 'App laten maken in elke stad';
  const items = cities
    .filter((c) => c.slug !== selfSlug)
    .map((c) => `<li><a href="${prefix}${c.slug}.html"><span>${label} ${esc(c.name)}</span></a></li>`)
    .join('');
  return `<section id="local-seo-all-cities-${kind}-${selfSlug}" class="content-section-medium-top content-section-footer"><div class="content-section-full-wrapper"><div class="content-section-inner scale layout-content"><h2>${h2}</h2><ul class="site-index local-seo-city-list">${items}</ul></div></div></section>`;
}

function citySectionWebsite(c) {
  const home = c.homeBase
    ? `Profecta Solutions is gevestigd in ${esc(c.name)} en werkt dagelijks voor ondernemers in ${c.province}.`
    : `Vanuit ons kantoor in Almere werken we persoonlijk en resultaatgericht voor ondernemers in ${esc(c.name)} en omgeving (${nearbyText(c)}).`;
  return `<section id="local-seo-website-maken-${c.slug}" class="content-section-medium-top content-section-footer"><div class="content-section-full-wrapper"><div class="content-section-inner scale layout-content"><h2>Webdesign voor ${c.adj} ondernemers</h2><p>${c.angle} We bouwen geen standaard template, maar een maatwerk website met een duidelijke propositie, sterke techniek en een stevige SEO-fundering, zodat je concurreert op de zoektermen die voor jouw branche in ${esc(c.name)} tellen.</p><p>${home} We combineren webdesign, technische SEO en (AI-)vindbaarheid, zodat je niet alleen een mooie site krijgt maar ook zichtbaar bent wanneer klanten zoeken op <strong>website maken ${esc(c.name)}</strong> of branchespecifieke zoekwoorden.</p><p><a class="meerinfoblok meerinfoblok-icon" href="adviesgesprek-aanvragen.html"><span>Gratis adviesgesprek in ${esc(c.name)}</span></a></p></div></div></section>`;
}

function citySectionApp(c) {
  const home = c.homeBase
    ? `Profecta Solutions zit in ${esc(c.name)} en bouwt maatwerk apps en platformen voor ondernemers in ${c.province}.`
    : `Vanuit Almere bouwen we maatwerk apps en platformen voor ondernemers in ${esc(c.name)} en omgeving (${nearbyText(c)}).`;
  return `<section id="local-seo-app-maken-${c.slug}" class="content-section-medium-top content-section-footer"><div class="content-section-full-wrapper"><div class="content-section-inner scale layout-content"><h2>App laten maken voor ${c.adj} ondernemers</h2><p>Wil je in ${esc(c.name)} een app laten maken die echt werk uit handen neemt? We bouwen web-apps, mobiele apps en platformen op maat: van klantportalen en boekingssystemen tot interne tools met AI. Altijd gericht op jouw proces, niet op een standaard sjabloon.</p><p>${home} Naast de techniek zorgen we dat je app vindbaar is wanneer klanten zoeken op <strong>app laten maken ${esc(c.name)}</strong> en aanverwante termen.</p><p><a class="meerinfoblok meerinfoblok-icon" href="adviesgesprek-aanvragen.html"><span>Gratis adviesgesprek in ${esc(c.name)}</span></a></p></div></div></section>`;
}

function serveList(c) {
  return [...new Set([c.name, ...c.nearby, c.province])];
}
function areaServedArray(c) {
  return JSON.stringify(serveList(c));
}
function areaServedObjects(c) {
  return `[${serveList(c).map((n) => `{"@type":"City","name":"${n}"}`).join(',')}]`;
}

// ---------- WEBSITE PAGES ----------
function buildWebsitePage(template, c) {
  let html = template;
  const url = `${DOMAIN}/website-maken-${c.slug}.html`;
  const urlEsc = url.replace(/\//g, '\\/');
  const baseUrl = `${DOMAIN}/website-maken-amsterdam.html`;
  const baseUrlEsc = baseUrl.replace(/\//g, '\\/');

  // self URLs
  html = html.split(baseUrlEsc).join(urlEsc);
  html = html.split(baseUrl).join(url);

  // titles / og
  html = html.split('Website maken Amsterdam | Profecta Solutions').join(`Website maken ${c.name} | Profecta Solutions`);

  // keywords
  html = html.replace(
    'website maken amsterdam, website laten maken amsterdam, webdesign amsterdam, website bureau amsterdam, webdesign bureau amsterdam',
    `website maken ${c.name.toLowerCase()}, website laten maken ${c.name.toLowerCase()}, webdesign ${c.name.toLowerCase()}, website bureau ${c.name.toLowerCase()}, webdesign bureau ${c.name.toLowerCase()}`,
  );

  // description (multiple occurrences)
  const desc = `Website maken in ${esc(c.name)}? Profecta Solutions levert maatwerk websites met sterke SEO, snelle laadtijden en focus op conversie. Gratis adviesgesprek.`;
  html = html.split('Website maken in Amsterdam? Profecta Solutions levert maatwerk websites met sterke SEO, snelle laadtijden en focus op conversie. Gratis adviesgesprek.').join(desc);

  // schema names
  html = html.split('"name": "Website maken Amsterdam"').join(`"name": "Website maken ${c.name}"`);
  html = html.split('"name": "Profecta Solutions \u2013 website maken Amsterdam"').join(`"name": "Profecta Solutions \u2013 website maken ${c.name}"`);

  // areaServed
  html = html.split('["Amsterdam","Amstelveen","Haarlem","Zaandam","Almere","Noord-Holland"]').join(areaServedArray(c));
  html = html.split('[{"@type":"City","name":"Amsterdam"},{"@type":"City","name":"Amstelveen"},{"@type":"City","name":"Haarlem"},{"@type":"City","name":"Zaandam"},{"@type":"City","name":"Almere"},{"@type":"City","name":"Noord-Holland"}]').join(areaServedObjects(c));

  // H1 + intro
  const h1Block = '<h1>Website maken in Amsterdam</h1><p>Voor ondernemers in Amsterdam bouwen we websites die professioneel ogen, snel laden en gevonden worden. Vanuit Almere werken we persoonlijk en resultaatgericht voor de regio Amsterdam.</p>';
  const intro = c.homeBase
    ? `Voor ondernemers in ${esc(c.name)} bouwen we websites die professioneel ogen, snel laden en gevonden worden. Als bureau uit ${esc(c.name)} werken we persoonlijk en resultaatgericht.`
    : `Voor ondernemers in ${esc(c.name)} bouwen we websites die professioneel ogen, snel laden en gevonden worden. Vanuit Almere werken we persoonlijk en resultaatgericht voor de regio ${esc(c.name)}.`;
  html = html.replace(h1Block, `<h1>Website maken in ${esc(c.name)}</h1><p>${intro}</p>`);

  // local-seo block
  html = html.replace(
    /<section id="local-seo-regions"[\s\S]*?<\/section>(?=<section\r?\nid="inhoud")/,
    regionsSection('website', c.slug) + citySectionWebsite(c) + allCitiesSection('website', c.slug),
  );

  // menu active: amsterdam is active in template
  if (c.slug !== 'amsterdam') {
    html = html.replace('href="website-maken-amsterdam.html" class="active"', 'href="website-maken-amsterdam.html" class=""');
  }
  if (c.slug === 'almere') {
    html = html.replace('href="website-maken-almere.html" class=""', 'href="website-maken-almere.html" class="active"');
  }

  return html;
}

// ---------- APP PAGES ----------
function appCityLdJson(c) {
  const obj = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'Service',
        '@id': `${DOMAIN}/app-maken-${c.slug}.html#service`,
        name: `App laten maken ${c.name}`,
        serviceType: 'App- en platformontwikkeling op maat',
        provider: { '@id': `${DOMAIN}/#Organization` },
        areaServed: serveList(c),
        description: `App laten maken in ${c.name}? Profecta Solutions bouwt maatwerk apps en platformen die processen automatiseren en werk uit handen nemen.`,
        url: `${DOMAIN}/app-maken-${c.slug}.html`,
      },
      {
        '@type': 'ProfessionalService',
        '@id': `${DOMAIN}/app-maken-${c.slug}.html#local`,
        name: `Profecta Solutions \u2013 app laten maken ${c.name}`,
        url: `${DOMAIN}/app-maken-${c.slug}.html`,
        telephone: '+31 6 20 33 90 09',
        image: `${DOMAIN}/images/template/profecta-logo.jpg`,
        address: {
          '@type': 'PostalAddress',
          streetAddress: 'P.J. Oudweg 5',
          postalCode: '1314WP',
          addressLocality: 'Almere',
          addressRegion: 'Flevoland',
          addressCountry: 'NL',
        },
        geo: { '@type': 'GeoCoordinates', latitude: 52.3755, longitude: 5.2157 },
        areaServed: serveList(c).map((n) => ({ '@type': 'City', name: n })),
        aggregateRating: RATING,
      },
    ],
  };
  return `<script type="application/ld+json">${JSON.stringify(obj)}</script>`;
}

function buildAppPage(template, c) {
  let html = template;
  const url = `${DOMAIN}/app-maken-${c.slug}.html`;
  const urlEsc = url.replace(/\//g, '\\/');
  const baseUrl = `${DOMAIN}/wat-kost-een-app-laten-maken.html`;
  const baseUrlEsc = baseUrl.replace(/\//g, '\\/');

  // self URLs
  html = html.split(baseUrlEsc).join(urlEsc);
  html = html.split(baseUrl).join(url);

  // titles / og title / site_name
  html = html.split('Wat kost een app maken? Kosten, keuzes &amp; mogelijkheden').join(`App laten maken ${esc(c.name)} | Profecta Solutions`);

  // keywords
  html = html.replace(
    'Kosten webshop laten maken, wat kost een webshop laten maken.',
    `app laten maken ${c.name.toLowerCase()}, app maken ${c.name.toLowerCase()}, app ontwikkelaar ${c.name.toLowerCase()}, platform laten maken ${c.name.toLowerCase()}`,
  );

  // description
  const desc = `App laten maken in ${esc(c.name)}? Profecta Solutions bouwt maatwerk apps en platformen die processen automatiseren en werk uit handen nemen. Gratis adviesgesprek.`;
  html = html.split('Ontdek welke kosten bij een webshop komen kijken, hoe de prijs wordt opgebouwd en wat dit concreet betekent voor jouw bedrijf.').join(desc);

  // og:image junk -> real image
  html = html.replace('content="veelgestelde vragen Profecta Solutions, website, app, webshop, support"', `content="${OG_IMAGE}"`);

  // H1 + intro
  const h1Block = '<h1>Wat kost een app maken?</h1><p>&ldquo;Wat kost een app maken?&rdquo; hangt af van wat je app moet doen: web, mobiel of beide, welke koppelingen je nodig hebt en hoe complex de logica is. Bij Profecta Solutions bouwen we maatwerk apps die aansluiten op jouw proces.</p>';
  const intro = c.homeBase
    ? `App laten maken in ${esc(c.name)}? Als bureau uit ${esc(c.name)} bouwen we maatwerk apps en platformen die processen automatiseren en aansluiten op jouw manier van werken.`
    : `App laten maken in ${esc(c.name)}? Vanuit Almere bouwen we voor ondernemers in ${esc(c.name)} maatwerk apps en platformen die processen automatiseren en aansluiten op jouw proces.`;
  html = html.replace(h1Block, `<h1>App laten maken in ${esc(c.name)}</h1><p>${intro}</p>`);

  // inject local-seo + city ld+json before #inhoud
  const inject = appCityLdJson(c) + regionsSection('app', c.slug) + citySectionApp(c) + allCitiesSection('app', c.slug);
  html = html.replace(/<section\r?\nid="inhoud"/, `${inject}<section\nid="inhoud"`);

  return html;
}

// ---------- RUN ----------
const websiteTemplate = fs.readFileSync(path.join(root, 'website-maken-amsterdam.html'), 'utf8');
const appTemplate = fs.readFileSync(path.join(root, 'wat-kost-een-app-laten-maken.html'), 'utf8');

const generated = [];
for (const c of cities) {
  // website: skip overwriting the two originals to keep them untouched
  if (c.slug !== 'amsterdam' && c.slug !== 'almere') {
    const wHtml = buildWebsitePage(websiteTemplate, c);
    fs.writeFileSync(path.join(root, `website-maken-${c.slug}.html`), wHtml);
    console.log('website', c.slug);
  }
  generated.push(`website-maken-${c.slug}.html`);

  const aHtml = buildAppPage(appTemplate, c);
  fs.writeFileSync(path.join(root, `app-maken-${c.slug}.html`), aHtml);
  console.log('app', c.slug);
  generated.push(`app-maken-${c.slug}.html`);
}

// Amsterdam + Almere website: voeg crosslinks toe zonder volledige pagina te overschrijven
for (const slug of ['amsterdam', 'almere']) {
  const file = `website-maken-${slug}.html`;
  const p = path.join(root, file);
  let html = fs.readFileSync(p, 'utf8');
  if (!html.includes(`local-seo-all-cities-website-${slug}`)) {
    html = html.replace(
      /(<section id="local-seo-website-maken-[^"]+"[\s\S]*?<\/section>)/,
      `$1${allCitiesSection('website', slug)}`,
    );
  }
  if (!html.includes('website-maken-nederland.html')) {
    html = html.replace(
      /(<section id="local-seo-regions"[\s\S]*?<p>We helpen ondernemers[\s\S]*?<\/p>)/,
      (m) => (m.includes('website-maken-nederland.html') ? m : m.replace('</p>', ' Alle steden staan op ons <a href="website-maken-nederland.html"><span>overzicht website maken per stad</span></a>.</p>')),
    );
  }
  fs.writeFileSync(p, html);
  console.log('website crosslinks', slug);
}

// expose list for sitemap script
fs.writeFileSync(
  path.join(__dirname, 'local-seo-pages.json'),
  JSON.stringify({ cities: cities.map((c) => ({ slug: c.slug, name: c.name })), pages: generated }, null, 2),
);

console.log(`\nKlaar: ${generated.length} stadspagina's (incl. bestaande amsterdam/almere website).`);
