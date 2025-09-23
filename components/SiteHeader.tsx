'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

import { LanguageToggle } from './LanguageToggle';

const NAV_LINKS = [
  { href: '/', label: '首页' },
  { href: '/showcases', label: '灵感索引' },
  { href: '/search', label: '搜索' },
];

export function SiteHeader() {
  const pathname = usePathname();

  return (
    <header className="sticky top-0 z-40 border-b border-white/10 bg-black/40 backdrop-blur">
      <div className="mx-auto flex w-full max-w-7xl items-center justify-between gap-6 px-6 py-4 md:px-10 lg:px-16">
        <Link href="/" className="focus-outline text-sm font-semibold uppercase tracking-[0.3em] text-white/70 hover:text-white">
          SparkKit
        </Link>
        <nav className="hidden items-center gap-4 text-xs text-white/60 sm:flex">
          {NAV_LINKS.map((link) => {
            const isActive = pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`focus-outline rounded-full px-3 py-1 transition ${
                  isActive
                    ? 'bg-white/10 text-white'
                    : 'hover:bg-white/5 hover:text-white'
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
