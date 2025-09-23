import type { MetadataRoute } from 'next';

import { fetchShowcases } from '@/lib/supabase';
import { getSiteUrl } from '@/lib/site';

export const revalidate = 86400; // regenerate daily

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = getSiteUrl();
  const showcases = await fetchShowcases({ limit: 5000 });

  const staticEntries: MetadataRoute.Sitemap = [
    {
      url: baseUrl,
      lastModified: new Date().toISOString(),
      changeFrequency: 'daily',
      priority: 1,
    },
    {
      url: `${baseUrl}/showcases`,
      changeFrequency: 'hourly',
      priority: 0.9,
    },
    {
      url: `${baseUrl}/search`,
      changeFrequency: 'hourly',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/status`,
      changeFrequency: 'daily',
      priority: 0.6,
    },
  ];

  const detailEntries: MetadataRoute.Sitemap = showcases.map((record) => ({
    url: `${baseUrl}/p/${record.pen_user}/${record.pen_slug}`,
    lastModified: record.updated_at ?? record.created_at ?? undefined,
    changeFrequency: 'hourly',
    priority: 0.8,
  }));

  return [...staticEntries, ...detailEntries];
}
