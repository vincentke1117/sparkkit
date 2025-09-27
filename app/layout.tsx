import '@/app/globals.css';

import type { Metadata, Viewport } from 'next';

import { LanguageProvider } from '@/components/LanguageProvider';
import { SiteHeader } from '@/components/SiteHeader';
import { getDefaultLocale, getOgImageUrl, getSiteUrl } from '@/lib/site';

const siteUrl = getSiteUrl();
const ogImageUrl = getOgImageUrl();
const defaultLocale = getDefaultLocale();
const rssUrl = getSiteUrl('/rss.xml');


export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: '灵点集 · SparkKit — 前端灵感与复用 | CodePen 精选解读',
    template: '%s · 灵点集 · SparkKit',
  },
  description:
    '每天 6 条精选 CodePen 作品，配要点、复用步骤与性能提示。支持标签/难度/技术栈检索与官方嵌入，快速把灵感落地。',
  alternates: {
    canonical: siteUrl,
    languages: {
      'en-US': getSiteUrl('/?hl=en'),
      'zh-CN': getSiteUrl('/?hl=zh-cn'),
      'x-default': siteUrl,
    },
  },
  openGraph: {
    type: 'website',
    title: '灵点集 · SparkKit — 前端灵感与复用 | CodePen 精选解读',
    description:
      '每天 6 条精选 CodePen 作品，附要点、复用步骤与性能提示，灵感随取随用。',
    url: siteUrl,
    siteName: 'SparkKit',
    images: [
      {
        url: ogImageUrl,
        width: 1200,
        height: 630,
        alt: 'SparkKit — Inspire · Decode · Reuse',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    site: '@sparkkit',
    creator: '@sparkkit',
    title: '灵点集 · SparkKit — 前端灵感与复用',
    description: '6 条精选 CodePen 作品每日更新，解读即看即用。',
    images: [ogImageUrl],
  },
  icons: {
    icon: '/favicon.ico',
  },
};

export const viewport: Viewport = {
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
            <footer className="border-t border-white/10 bg-black/30 py-8 text-center text-xs text-white/60">
              <p>© 2025 SparkKit · CodePen inspiration by VincentK.</p>
            </footer>
          </div>
        </LanguageProvider>
      </body>
    </html>
  );
}
