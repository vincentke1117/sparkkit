import type { MetadataRoute } from 'next';

import { getSiteUrl } from '@/lib/site';

export default function robots(): MetadataRoute.Robots {
  const siteUrl = getSiteUrl();

  const { host } = new URL(siteUrl);

  return {
    rules: [
      {
        userAgent: '*',
        allow: ['/','/ads.txt'],
        disallow: ['/status'],
      },
    ],
    sitemap: [`${siteUrl}/sitemap.xml`],
    host,
  };
}
