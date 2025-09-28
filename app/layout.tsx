import '@/app/globals.css';

import type { Metadata, Viewport } from 'next';

import { LanguageProvider } from '@/components/LanguageProvider';
import { SiteFooter } from '@/components/SiteFooter';
import { SiteHeader } from '@/components/SiteHeader';
import { createHomeMetadata } from '@/lib/meta';
import { getDefaultLocale, getSiteUrl } from '@/lib/site';

const siteUrl = getSiteUrl();
const defaultLocale = getDefaultLocale();
const rssUrl = getSiteUrl('/rss.xml');

const baseMetadata = createHomeMetadata();

export const metadata: Metadata = {
  ...baseMetadata,
  metadataBase: new URL(siteUrl),
  icons: {
    icon: '/favicon.ico',
  },
  robots: {
    index: true,
    follow: true,
  },
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
  themeColor: '#070b1a',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const websiteJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: 'SparkKit',
    url: siteUrl,
    potentialAction: {
      '@type': 'SearchAction',
      target: getSiteUrl('/showcases?q={search_term_string}'),
      'query-input': 'required name=search_term_string',
    },
  };

  return (
    <html lang={defaultLocale === 'zh' ? 'zh-CN' : 'en'}>
      <head>
        <link rel="preconnect" href="https://codepen.io" />
        <link rel="preconnect" href="https://assets.codepen.io" />
        <link rel="preconnect" href="https://cpwebassets.codepen.io" />
        <link rel="alternate" type="application/rss+xml" href={rssUrl} title="SparkKit RSS" />
      </head>
      <body className="relative min-h-screen bg-[--spark-background] text-white antialiased">
        <LanguageProvider defaultLocale={defaultLocale}>
          <script
            type="application/ld+json"
            suppressHydrationWarning
            dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteJsonLd) }}
          />
          <div className="hero-noise" aria-hidden />
          <div className="relative isolate flex min-h-screen flex-col overflow-x-hidden">
            <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(111,155,255,0.2),transparent_60%)]" aria-hidden />
            <SiteHeader />
            <main className="flex-1">{children}</main>
            <SiteFooter />
          </div>
        </LanguageProvider>
      </body>
    </html>
  );
}
