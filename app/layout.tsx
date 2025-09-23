import '@/app/globals.css';

import type { Metadata, Viewport } from 'next';
import { headers } from 'next/headers';

import { LanguageProvider } from '@/components/LanguageProvider';
import { resolveInitialLocale } from '@/lib/i18n';

export const metadata: Metadata = {
  metadataBase: new URL('https://sparkkit.dev'),
  title: {
    default: 'SparkKit · Inspire · Decode · Reuse',
    template: '%s · SparkKit',
  },
  description:
    'SparkKit curates standout CodePen experiments with bilingual insights, reusable steps, and performance notes pulled from Supabase.',
  alternates: {
    canonical: 'https://sparkkit.dev',
    languages: {
      'en-US': 'https://sparkkit.dev',
      'zh-CN': 'https://sparkkit.dev?hl=zh-cn',
      'x-default': 'https://sparkkit.dev',
    },
  },
  openGraph: {
    type: 'website',
    title: 'SparkKit · Inspire · Decode · Reuse',
    description:
      'Discover CodePen masterpieces backed by Supabase with deep-dives, multilingual summaries, and ready-to-reuse steps.',
    url: 'https://sparkkit.dev',
    siteName: 'SparkKit',
    images: [
      {
        url: 'https://sparkkit.dev/og-cover.png',
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
    title: 'SparkKit · Inspire · Decode · Reuse',
    description:
      'Curated CodePen showcases with bilingual analysis, tags, and performance notes delivered from Supabase.',
    images: ['https://sparkkit.dev/og-cover.png'],
  },
  icons: {
    icon: '/favicon.ico',
  },
};

export const viewport: Viewport = {
  themeColor: '#070b1a',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const acceptLanguage = headers().get('accept-language');
  const locale = resolveInitialLocale(acceptLanguage);
  const websiteJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: 'SparkKit',
    url: 'https://sparkkit.dev',
    potentialAction: {
      '@type': 'SearchAction',
      target: 'https://sparkkit.dev/search?q={search_term_string}',
      'query-input': 'required name=search_term_string',
    },
  };

  return (
    <html lang={locale === 'zh' ? 'zh-CN' : 'en'}>
      <body className="relative min-h-screen bg-[--spark-background] text-white antialiased">
        <LanguageProvider defaultLocale={locale}>
          <script
            type="application/ld+json"
            suppressHydrationWarning
            dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteJsonLd) }}
          />
          <div className="hero-noise" aria-hidden />
          <div className="relative isolate flex min-h-screen flex-col overflow-x-hidden">
            <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(111,155,255,0.2),transparent_60%)]" aria-hidden />
            <main className="flex-1">{children}</main>
            <footer className="border-t border-white/10 bg-black/30 py-8 text-center text-xs text-white/60">
              <p>© {new Date().getFullYear()} SparkKit · CodePen inspiration decoded with Supabase.</p>
            </footer>
          </div>
        </LanguageProvider>
      </body>
    </html>
  );
}
