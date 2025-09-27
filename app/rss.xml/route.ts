import { NextResponse } from 'next/server';

import { getLocalizedList, getLocalizedText } from '@/lib/i18n';
import { fetchShowcases } from '@/lib/supabase';
import { ShowcaseRecord } from '@/lib/types';
import { buildPenUrl } from '@/lib/url';
import { getSiteUrl } from '@/lib/site';

const FEED_LIMIT = 100;

function escapeXml(input: string): string {
  return input
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}

function buildItem(record: ShowcaseRecord, siteUrl: string): string {
  const detailUrl = `${siteUrl}/p/${record.pen_user}/${record.pen_slug}`;
  const sourceUrl = buildPenUrl(record);
  const zhTitle = getLocalizedText(record, 'title', 'zh');
  const enTitle = getLocalizedText(record, 'title', 'en');
  const title = zhTitle ?? enTitle ?? `${record.pen_user}/${record.pen_slug}`;

  const zhSummary = getLocalizedText(record, 'summary', 'zh');
  const enSummary = getLocalizedText(record, 'summary', 'en');
  const keyPointsZh = getLocalizedList(record, 'key_points', 'zh');
  const keyPointsEn = getLocalizedList(record, 'key_points', 'en');

  const descriptionParts = [zhSummary, enSummary]
    .flatMap((value) => (value ? [value] : []))
    .concat(keyPointsZh.length > 0 ? keyPointsZh : [])
    .concat(keyPointsEn.length > 0 ? keyPointsEn : []);

  const description = descriptionParts.length > 0
    ? escapeXml(descriptionParts.join('\n\n'))
    : 'SparkKit · Inspire · Decode · Reuse';

  const pubDate = record.updated_at ?? record.created_at;
  const author = record.author_name ?? record.pen_user;

  return `    <item>
      <title>${escapeXml(title)}</title>
      <link>${escapeXml(detailUrl)}</link>
      <guid isPermaLink="true">${escapeXml(detailUrl)}</guid>
      <description>${description}</description>
      <author>${escapeXml(author)}</author>
      <category>${escapeXml(record.difficulty ?? 'Unspecified')}</category>
      ${
        record.tags && record.tags.length > 0
          ? record.tags.map((tag) => `<category>${escapeXml(tag)}</category>`).join('\n      ')
          : ''
      }
      <source url="${escapeXml(sourceUrl)}">CodePen</source>
      ${pubDate ? `<pubDate>${new Date(pubDate).toUTCString()}</pubDate>` : ''}
    </item>`;
}

export const revalidate = 86_400; // daily

export async function GET() {
  const siteUrl = getSiteUrl();
  const records = await fetchShowcases({ limit: FEED_LIMIT, order: 'latest' });
  const items = records.map((record) => buildItem(record, siteUrl)).join('\n');
  const lastBuild = new Date().toUTCString();

  const feed = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0">
  <channel>
    <title>SparkKit — RSS</title>
    <link>${escapeXml(siteUrl)}</link>
    <description>Daily curated CodePen showcases with bilingual analysis from SparkKit.</description>
    <language>zh-CN</language>
    <lastBuildDate>${lastBuild}</lastBuildDate>
    <ttl>1440</ttl>
${items}
  </channel>
</rss>`;

  return new NextResponse(feed, {
    headers: {
      'Content-Type': 'application/rss+xml; charset=utf-8',
      'Cache-Control': 'public, max-age=0, s-maxage=3600',
    },
  });
}
