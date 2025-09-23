import { NextResponse } from 'next/server';

import { fetchShowcases } from '@/lib/supabase';
import { getLocalizedText } from '@/lib/i18n';
import { buildPenUrl } from '@/lib/url';

export const revalidate = 21600; // 6 hours

export async function GET() {
  const baseUrl = 'https://sparkkit.dev';
  const showcases = await fetchShowcases({ limit: 100 });

  const items = showcases
    .map((item) => {
      const title = getLocalizedText(item, 'title', 'zh') ?? `${item.pen_user}/${item.pen_slug}`;
      const summary = getLocalizedText(item, 'summary', 'zh') ?? '';
      const url = `${baseUrl}/p/${item.pen_user}/${item.pen_slug}`;
      const original = buildPenUrl(item);
      const pubDate = item.created_at ? new Date(item.created_at).toUTCString() : new Date().toUTCString();
      return `<item>
  <title><![CDATA[${title}]]></title>
  <link>${url}</link>
  <guid>${item.id}</guid>
  <pubDate>${pubDate}</pubDate>
  <description><![CDATA[${summary}\n原作：${original}]]></description>
</item>`;
    })
    .join('\n');

  const rss = `<?xml version="1.0" encoding="UTF-8" ?>
<rss version="2.0">
  <channel>
    <title>SparkKit · CodePen Showcases</title>
    <link>${baseUrl}</link>
    <description>最新的 CodePen 灵感作品，来自 SparkKit 的双语解读。</description>
    <language>zh-CN</language>
    ${items}
  </channel>
</rss>`;

  return new NextResponse(rss, {
    headers: {
      'Content-Type': 'application/rss+xml; charset=utf-8',
      'Cache-Control': 'public, s-maxage=21600, stale-while-revalidate=3600',
    },
  });
}
