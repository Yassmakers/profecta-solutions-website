/**
 * Meld sitemap aan bij Bing (Google ping is deprecated sinds 2023).
 * Voor Google: gebruik Search Console → Sitemaps → sitemap.xml indienen.
 */
const SITEMAP = 'https://www.profecta-solutions.nl/sitemap.xml';

console.log('Google sitemap ping is deprecated. Gebruik Search Console:');
console.log('  https://search.google.com/search-console → Sitemaps → sitemap.xml\n');

try {
  const url = `https://www.bing.com/webmaster/ping.aspx?siteMap=${encodeURIComponent(SITEMAP)}`;
  const res = await fetch(url);
  console.log(`Bing: HTTP ${res.status} ${res.ok ? 'OK' : '(gebruik Bing Webmaster Tools als backup)'}`);
} catch (err) {
  console.error('Bing ping mislukt:', err.message);
}

console.log(`\nSitemap URL: ${SITEMAP}`);
