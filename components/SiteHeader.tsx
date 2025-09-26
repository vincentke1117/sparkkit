'use client';

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
    { href: '/', label: copy.nav.home, external: false },
    { href: '/showcases', label: copy.nav.showcases, external: false },
    { href: '/status', label: copy.nav.status, external: false },
  ];

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
                  key={link.href}
                  href={link.href}
                  className="focus-outline rounded-full px-3 py-1 transition hover:bg-white/5 hover:text-white"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {link.label}
                </a>
              );
            }

            const isActive = pathname === link.href || (link.href !== '/' && pathname.startsWith(`${link.href}/`));
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`focus-outline rounded-full px-3 py-1 transition ${
                  isActive ? 'bg-white/10 text-white' : 'hover:bg-white/5 hover:text-white'
                }`}
              >
                {link.label}
              </Link>
            );
          })}
        </nav>
        <LanguageToggle />
      </div>
    </header>
  );
}
