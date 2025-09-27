'use client';

import { useEffect, useState } from 'react';

import { useLanguage } from './LanguageProvider';

export function GeoClock() {
  const { locale } = useLanguage();
  const [state, setState] = useState(() => formatBeijingClock(locale));

  useEffect(() => {
    setState(formatBeijingClock(locale));

    const interval = setInterval(() => setState(formatBeijingClock(locale)), 60_000);
    return () => clearInterval(interval);
  }, [locale]);

  return (
    <div
      className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-3 py-1 text-xs uppercase tracking-wide"
      role="status"
      aria-live="polite"
    >
      <span className="h-2 w-2 rounded-full bg-gradient-to-br from-accent to-accentSecondary" aria-hidden />
      <span>{state.label}</span>
      <span className="text-white/70">{state.zone}</span>
    </div>
  );
}

type ClockState = {
  label: string;
  zone: string;
};

function formatBeijingClock(locale: 'zh' | 'en'): ClockState {
  const now = new Date();
  const localeKey = locale === 'zh' ? 'zh-CN' : 'en-CA';
  try {
    const formatter = new Intl.DateTimeFormat(localeKey, {
      timeZone: 'Asia/Shanghai',
      hourCycle: 'h23',
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      timeZoneName: 'short',
    });
    const parts = formatter.formatToParts(now);
    const get = (type: Intl.DateTimeFormatPartTypes) => parts.find((part) => part.type === type)?.value;

    const year = get('year') ?? '';
    const month = get('month') ?? '';
    const day = get('day') ?? '';
    const hour = get('hour') ?? '';
    const minute = get('minute') ?? '';
    const zone = get('timeZoneName') ?? 'UTC+8';

    const dateLabel =
      locale === 'zh'
        ? `${year}年${month}月${day}日 ${hour}:${minute}`
        : `${year}-${month}-${day} ${hour}:${minute}`;
    const prefix = locale === 'zh' ? '北京时间' : 'Beijing';

    return {
      label: `${prefix} · ${dateLabel}`,
      zone: zone.replace('GMT+8', 'UTC+8'),
    };
  } catch (error) {
    const fallback = now.toISOString().slice(0, 16).replace('T', ' ');
    return {
      label: `${locale === 'zh' ? '北京时间' : 'Beijing'} · ${fallback}`,
      zone: 'UTC+8',
    };
  }
}
