'use client';

import { useCallback } from 'react';

import { useLanguage } from './LanguageProvider';

const OPTIONS = [
  { locale: 'zh' as const, label: '中文' },
  { locale: 'en' as const, label: 'EN' },
];

export function LanguageToggle() {
  const { locale, setLocale } = useLanguage();

  const handleToggle = useCallback(
    (nextLocale: 'zh' | 'en') => {
      if (nextLocale !== locale) {
        setLocale(nextLocale);
      }
    },
    [locale, setLocale],
  );

  return (
    <div className="flex items-center gap-1 rounded-full border border-white/15 bg-black/40 p-1 text-xs text-white/70 shadow-inner">
      {OPTIONS.map((option) => {
        const active = option.locale === locale;
        return (
          <button
            key={option.locale}
            type="button"
            onClick={() => handleToggle(option.locale)}
            className={`focus-outline relative rounded-full px-3 py-1.5 transition ${
              active
                ? 'bg-gradient-to-r from-accent to-accentSecondary text-white shadow-[0_0_12px_rgba(99,102,241,0.45)]'
                : 'hover:text-white'
            }`}
            aria-pressed={active}
          >
            {option.label}
          </button>
        );
      })}
    </div>
  );
}
