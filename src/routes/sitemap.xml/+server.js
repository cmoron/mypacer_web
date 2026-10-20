// Généré au prérendu : lastmod suit chaque build au lieu d'une date figée.
export const prerender = true;

const PAGES = ['/', '/club'];

export function GET() {
  const lastmod = new Date().toISOString().slice(0, 10);
  const urls = PAGES.map(
    (path) => `  <url>\n    <loc>https://mypacer.fr${path}</loc>\n    <lastmod>${lastmod}</lastmod>\n  </url>`
  );
  const body = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls.join('\n')}
</urlset>
`;
  return new Response(body, {headers: {'Content-Type': 'application/xml'}});
}
