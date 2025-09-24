'use client';

import { useEffect, useState } from 'react';

import { useLanguage } from './LanguageProvider';

type ClockState = {
  time: string;
  timeZone: string;
};

function formatClock(locale: string): ClockState {
  const now = new Date();
  try {
    const formatter = new Intl.DateTimeFormat(locale, {
      hour: '2-digit',
      minute: '2-digit',
      timeZoneName: 'short',
    });
    const formatted = formatter.formatToParts(now);
    const time = formatted
      .filter((part) => part.type === 'hour' || part.type === 'minute' || part.type === 'literal')
      .map((part) => part.value)
      .join('');
    const tz = formatted.find((part) => part.type === 'timeZoneName')?.value ?? 'UTC';
    return { time, timeZone: tz };
  } catch (error) {
    return { time: now.toUTCString(), timeZone: 'UTC' };
  }
}

export function GeoClock() {
  const { locale } = useLanguage();
  const [state, setState] = useState<ClockState>(() => formatClock(locale === 'zh' ? 'zh-CN' : 'en-US'));

  useEffect(() => {
    const targetLocale = typeof navigator !== 'undefined' ? navigator.language : locale === 'zh' ? 'zh-CN' : 'en-US';
    setState(formatClock(targetLocale));

    const interval = setInterval(() => setState(formatClock(targetLocale)), 60_000);
    return () => clearInterval(interval);
  }, [locale]);

  return (
    <div className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-3 py-1 text-xs uppercase tracking-wide">
      <span className="h-2 w-2 rounded-full bg-gradient-to-br from-accent to-accentSecondary" aria-hidden />
      <span>{state.time}</span>
      <span className="text-white/70">{state.timeZone}</span>
    </div>
  );
}
