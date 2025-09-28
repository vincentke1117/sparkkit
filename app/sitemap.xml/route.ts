const sitemapXml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>https://spark.vincentke.cc</loc>
    <lastmod>2025-09-28T14:32:18+00:00</lastmod>
    <changefreq>daily</changefreq>
    <priority>1.0</priority>
  </url>
  <url>
    <loc>https://spark.vincentke.cc/showcases</loc>
    <lastmod>2025-09-28T14:32:18+00:00</lastmod>
    <changefreq>hourly</changefreq>
    <priority>0.9</priority>
  </url>
  <url>
    <loc>https://spark.vincentke.cc/search</loc>
    <lastmod>2025-09-28T14:32:18+00:00</lastmod>
    <changefreq>hourly</changefreq>
    <priority>0.8</priority>
  </url>
  <url>
    <loc>https://spark.vincentke.cc/status</loc>
    <lastmod>2025-09-28T14:32:18+00:00</lastmod>
    <changefreq>daily</changefreq>
    <priority>0.6</priority>
  </url>
  <url>
    <loc>https://spark.vincentke.cc/p/P1N2O/pyBNzX</loc>
    <lastmod>2025-09-28T00:47:54+00:00</lastmod>
    <changefreq>daily</changefreq>
    <priority>0.8</priority>
  </url>
  <url>
    <loc>https://spark.vincentke.cc/p/luis-lessrain/dPPOGaZ</loc>
    <lastmod>2025-09-25T13:10:23+00:00</lastmod>
    <changefreq>daily</changefreq>
    <priority>0.8</priority>
  </url>
  <url>
    <loc>https://spark.vincentke.cc/p/dazulu/VVZrQv</loc>
    <lastmod>2025-09-26T15:24:53+00:00</lastmod>
    <changefreq>daily</changefreq>
    <priority>0.8</priority>
  </url>
  <url>
    <loc>https://spark.vincentke.cc/p/carmenansio/myyWKoG</loc>
    <lastmod>2025-09-24T06:19:07+00:00</lastmod>
    <changefreq>daily</changefreq>
    <priority>0.8</priority>
  </url>
  <url>
    <loc>https://spark.vincentke.cc/p/abxlfazl/VwKzaEm</loc>
    <lastmod>2025-09-28T00:48:00+00:00</lastmod>
    <changefreq>daily</changefreq>
    <priority>0.8</priority>
  </url>
  <url>
    <loc>https://spark.vincentke.cc/p/yuhomyan/OJMejWJ</loc>
    <lastmod>2025-09-28T00:48:26+00:00</lastmod>
    <changefreq>daily</changefreq>
    <priority>0.8</priority>
  </url>
</urlset>
`;

export async function GET() {
  return new Response(sitemapXml, {
    headers: {
      'content-type': 'application/xml; charset=UTF-8',
      'cache-control': 'public, max-age=86400, stale-while-revalidate=43200',
    },
  });
}
