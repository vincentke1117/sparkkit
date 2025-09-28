'use client';

import { Suspense } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

import { getUiCopy } from '@/lib/translations';

import { LanguageToggle } from './LanguageToggle';
import { useLanguage } from './LanguageProvider';

export function SiteHeader() {
  const { locale } = useLanguage();
  const pathname = usePathname();
  const copy = getUiCopy(locale);

  const navLinks = [
    { path: '/', label: copy.nav.home, external: false },
    { path: '/showcases', label: copy.nav.showcases, external: false },
    { path: '/status', label: copy.nav.status, external: false },
  ];

  const localeQuery = locale === 'zh' ? 'hl=zh-cn' : 'hl=en';

  const buildHref = (path: string) => {
    if (path.startsWith('http')) {
      return path;
    }
    if (!localeQuery) {
      return path;
    }
    const separator = path.includes('?') ? '&' : '?';
    return `${path}${separator}${localeQuery}`;
  };

  return (
    <header className="sticky top-0 z-40 border-b border-white/10 bg-black/40 backdrop-blur">
      <div className="mx-auto flex w-full max-w-7xl items-center justify-between gap-6 px-6 py-4 md:px-10 lg:px-16">
        <Link href="/" className="focus-outline text-sm font-semibold uppercase tracking-[0.3em] text-white/70 hover:text-white">
          SparkKit
        </Link>
        <nav className="hidden items-center gap-4 text-xs text-white/60 sm:flex">
    {navLinks.map((link) => {
            if (link.external) {
              return (
                <a
                  key={link.path}
                  href={buildHref(link.path)}
                  className="focus-outline rounded-full px-3 py-1 transition hover:bg-white/5 hover:text-white"
                  target="_blank"
                  rel="noopener noreferrer nofollow"
                >
                  {link.label}
                </a>
              );
            }

            const isActive = pathname === link.path || (link.path !== '/' && pathname.startsWith(`${link.path}/`));
            return (
              <Link
                key={link.path}
                href={buildHref(link.path)}
                className={`focus-outline rounded-full px-3 py-1 transition ${
                  isActive ? 'bg-white/10 text-white' : 'hover:bg-white/5 hover:text-white'
                }`}
              >
                {link.label}
              </Link>
            );
          })}
        </nav>
        <Suspense fallback={<span className="text-xs uppercase tracking-[0.2em] text-white/40">···</span>}>
          <LanguageToggle />
        </Suspense>
      </div>
    </header>
  );
}
