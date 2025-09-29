import { fetchShowcases } from '@/lib/supabase';
import { getSiteUrl } from '@/lib/site';
import { ShowcaseRecord } from '@/lib/types';

const MAX_SHOWCASES = 5000;

function escapeXml(value: string): string {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}

function formatLastmod(input?: string | Date | null): string | null {
  if (!input) {
    return null;
  }

  const date = input instanceof Date ? input : new Date(input);
  if (Number.isNaN(date.getTime())) {
    return null;
  }

  return date.toISOString().replace(/\.\d{3}Z$/, '+00:00');
}

function buildUrlEntry({
  loc,
  lastmod,
  changefreq,
  priority,
}: {
  loc: string;
  lastmod?: string | null;
  changefreq?: string | null;
  priority?: string | number | null;
}): string {
  const parts = [`  <url>`, `    <loc>${escapeXml(loc)}</loc>`];

  if (lastmod) {
    parts.push(`    <lastmod>${escapeXml(lastmod)}</lastmod>`);
  }

  if (changefreq) {
    parts.push(`    <changefreq>${escapeXml(changefreq)}</changefreq>`);
  }

  if (priority !== null && priority !== undefined) {
    parts.push(`    <priority>${priority}</priority>`);
  }

  parts.push('  </url>');
  return parts.join('\n');
}

function resolveDetailUrl(record: ShowcaseRecord): string | null {
  if (!record.pen_user || !record.pen_slug) {
    return null;
  }

  return getSiteUrl(`/p/${record.pen_user}/${record.pen_slug}`);
}

function resolveLastModified(record: ShowcaseRecord, fallback: Date): string | null {
  return (
    formatLastmod(record.updated_at ?? record.created_at ?? null) ??
    formatLastmod(fallback)
  );
}

export async function GET() {
  const now = new Date();

  const staticEntries = [
    {
      loc: getSiteUrl('/'),
      changefreq: 'daily',
      priority: '1.0',
    },
    {
      loc: getSiteUrl('/showcases'),
      changefreq: 'hourly',
      priority: '0.9',
    },
    {
      loc: getSiteUrl('/search'),
      changefreq: 'hourly',
      priority: '0.8',
    },
    {
      loc: getSiteUrl('/status'),
      changefreq: 'daily',
      priority: '0.6',
    },
    {
      loc: getSiteUrl('/privacy'),
      changefreq: 'yearly',
      priority: '0.4',
    },
    {
      loc: getSiteUrl('/terms'),
      changefreq: 'yearly',
      priority: '0.4',
    },
    {
      loc: getSiteUrl('/support'),
      changefreq: 'yearly',
      priority: '0.4',
    },
  ].map((entry) => ({
    ...entry,
    lastmod: formatLastmod(now),
  }));

  let showcaseEntries: string[] = [];

  try {
    const showcases = await fetchShowcases({
      order: 'latest',
      limit: MAX_SHOWCASES,
    });

    showcaseEntries = showcases
      .map((record) => {
        const loc = resolveDetailUrl(record);
        if (!loc) {
          return null;
        }

        const lastmod = resolveLastModified(record, now);

        return buildUrlEntry({
          loc,
          lastmod,
          changefreq: 'daily',
          priority: '0.8',
        });
      })
      .filter((entry): entry is string => Boolean(entry));
  } catch (error) {
    console.error('[SparkKit] Failed to load showcases for sitemap:', error);
  }

  const urlEntries = [
    ...staticEntries.map((entry) =>
      buildUrlEntry({
        loc: entry.loc,
        lastmod: entry.lastmod,
        changefreq: entry.changefreq,
        priority: entry.priority,
      }),
    ),
    ...showcaseEntries,
  ];

  const xml = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urlEntries.join('\n')}\n</urlset>`;

  return new Response(xml, {
    headers: {
      'content-type': 'application/xml; charset=UTF-8',
      'cache-control': 'public, max-age=3600, stale-while-revalidate=43200',
    },
  });
}
