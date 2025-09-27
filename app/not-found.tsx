'use client';

import Link from 'next/link';

import { useLanguage } from '@/components/LanguageProvider';
import { getUiCopy } from '@/lib/translations';

export default function NotFound() {
  const { locale } = useLanguage();
  const copy = getUiCopy(locale);
  const localeQuery = locale === 'zh' ? 'hl=zh-cn' : 'hl=en';

  return (
    <div className="mx-auto flex min-h-[60vh] w-full max-w-3xl flex-col items-center justify-center gap-6 px-6 text-center text-white">
      <h1 className="text-4xl font-semibold text-gradient">{copy.errors.notFoundTitle}</h1>
      <p className="text-sm text-white/70">{copy.errors.notFoundDescription}</p>
      <div className="flex flex-wrap items-center justify-center gap-4 text-sm">
        <Link
          href={`/showcases?${localeQuery}`}
          className="neon-border focus-outline inline-flex items-center gap-2 rounded-full bg-white/10 px-6 py-3"
        >
          {copy.errors.goToIndex}
        </Link>
        <Link
          href={`/?${localeQuery}`}
          className="focus-outline inline-flex items-center gap-2 rounded-full border border-white/20 px-6 py-3 text-white/80 hover:border-accent/60 hover:text-white"
        >
          {copy.errors.goHome}
        </Link>
      </div>
    </div>
  );
}
