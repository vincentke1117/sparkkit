'use client';

import Link from 'next/link';

import { getUiCopy } from '@/lib/translations';

import { useLanguage } from './LanguageProvider';

function buildLocalizedHref(path: string, localeQuery: string) {
  if (!localeQuery) {
    return path;
  }
  const separator = path.includes('?') ? '&' : '?';
  return `${path}${separator}${localeQuery}`;
}

export function SiteFooter() {
  const { locale } = useLanguage();
  const copy = getUiCopy(locale);
  const localeQuery = locale === 'zh' ? 'hl=zh-cn' : 'hl=en';

  const links = [
    { href: '/privacy', label: copy.footer.privacy },
    { href: '/terms', label: copy.footer.terms },
    { href: '/support', label: copy.footer.support },
  ];

  return (
    <footer className="border-t border-white/10 bg-black/30 py-8 text-xs text-white/60">
      <div className="mx-auto flex w-full max-w-7xl flex-col gap-4 px-6 text-center md:flex-row md:items-center md:justify-between md:text-left">
        <div className="space-y-1">
          <p>{copy.footer.copyright}</p>
          <p className="text-white/40">{copy.footer.compliance}</p>
        </div>
        <nav className="flex flex-wrap items-center justify-center gap-4">
          {links.map((link) => (
            <Link
              key={link.href}
              href={buildLocalizedHref(link.href, localeQuery)}
              className="focus-outline rounded-full px-3 py-1 text-white/60 transition hover:bg-white/5 hover:text-white"
            >
              {link.label}
            </Link>
          ))}
        </nav>
      </div>
    </footer>
  );
}
