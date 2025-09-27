'use client';

import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';

import { normalizeNavigatorLanguage, SupportedLocale } from '@/lib/i18n';

type LanguageContextValue = {
  locale: SupportedLocale;
  setLocale: (locale: SupportedLocale) => void;
};

const LanguageContext = createContext<LanguageContextValue | undefined>(undefined);

export function LanguageProvider({
  defaultLocale,
  children,
}: {
  defaultLocale: SupportedLocale;
  children: React.ReactNode;
}) {
  const [locale, setLocaleState] = useState<SupportedLocale>(defaultLocale);

  useEffect(() => {
    if (typeof window === 'undefined') {
      return;
    }

    const syncFromUrl = () => {
      const params = new URLSearchParams(window.location.search);
      const hl = params.get('hl');
      const localeFromUrl = normalizeNavigatorLanguage(hl ?? undefined);

      if (localeFromUrl && localeFromUrl !== locale) {
        setLocaleState(localeFromUrl);
        return;
      }

      const navigatorLocale = typeof navigator !== 'undefined' ? normalizeNavigatorLanguage(navigator.language) : null;
      const fallback = navigatorLocale ?? defaultLocale;
      if (fallback !== locale) {
        setLocaleState(fallback);
      }
    };

    syncFromUrl();
    window.addEventListener('popstate', syncFromUrl);

    return () => {
      window.removeEventListener('popstate', syncFromUrl);
    };
  }, [defaultLocale, locale]);

  const setLocale = useCallback((next: SupportedLocale) => {
    setLocaleState(next);
  }, []);

  const value = useMemo(() => ({ locale, setLocale }), [locale, setLocale]);

  return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>;
}

export function useLanguage(): LanguageContextValue {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within LanguageProvider');
  }
  return context;
}
