import { ShowcaseRecord } from './types';

export type SupportedLocale = 'zh' | 'en';

export function resolveInitialLocale(acceptLanguage?: string | null): SupportedLocale {
  if (!acceptLanguage) {
    return 'en';
  }

  const normalized = acceptLanguage.toLowerCase();
  if (normalized.includes('zh')) {
    return 'zh';
  }

  return 'en';
}

export function normalizeNavigatorLanguage(language?: string | null): SupportedLocale | null {
  if (!language) {
    return null;
  }

  const normalized = language.toLowerCase();
  if (normalized.startsWith('zh')) {
    return 'zh';
  }

  if (normalized.startsWith('en')) {
    return 'en';
  }

  return null;
}

export function getLocalizedText(
  record: ShowcaseRecord,
  field: 'title' | 'summary' | 'headline' | 'body' | 'perf',
  preferredLocale: SupportedLocale = 'en',
): string | null {
  const mapping: Record<typeof field, { zh: keyof ShowcaseRecord; en: keyof ShowcaseRecord }> = {
    title: { zh: 'title_zh', en: 'title_en' },
    summary: { zh: 'summary_zh', en: 'summary_en' },
    headline: { zh: 'headline_zh', en: 'headline_en' },
    body: { zh: 'body_md_zh', en: 'body_md_en' },
    perf: { zh: 'perf_notes_zh', en: 'perf_notes_en' },
  };

  const zhValue = record[mapping[field].zh];
  const enValue = record[mapping[field].en];
  const zhText = typeof zhValue === 'string' && zhValue.trim().length > 0 ? zhValue : null;
  const enText = typeof enValue === 'string' && enValue.trim().length > 0 ? enValue : null;

  if (preferredLocale === 'zh') {
    return zhText ?? enText;
  }

  return enText ?? zhText;
}

export function getLocalizedList(
  record: ShowcaseRecord,
  field: 'key_points' | 'reuse_steps',
  preferredLocale: SupportedLocale = 'en',
): string[] {
  const mapping: Record<typeof field, { zh: keyof ShowcaseRecord; en: keyof ShowcaseRecord }> = {
    key_points: { zh: 'key_points_zh', en: 'key_points_en' },
    reuse_steps: { zh: 'reuse_steps_zh', en: 'reuse_steps_en' },
  };

  const zhValue = record[mapping[field].zh];
  const enValue = record[mapping[field].en];
  const zhList = Array.isArray(zhValue) && zhValue.length > 0 ? zhValue : null;
  const enList = Array.isArray(enValue) && enValue.length > 0 ? enValue : null;

  if (preferredLocale === 'zh') {
    return zhList ?? enList ?? [];
  }

  return enList ?? zhList ?? [];
}

export function formatDateReadable(value?: string | null, locale: SupportedLocale = 'en'): string | null {
  if (!value) {
    return null;
  }

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) {
    return null;
  }

  try {
    return new Intl.DateTimeFormat(locale === 'zh' ? 'zh-CN' : 'en-US', {
      year: 'numeric',
      month: 'short',
      day: '2-digit',
    }).format(date);
  } catch (error) {
    return date.toISOString();
  }
}
