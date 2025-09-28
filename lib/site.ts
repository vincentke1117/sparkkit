import { SupportedLocale } from './i18n';

function normalizeUrl(value?: string | null): string | null {
  if (!value) {
    return null;
  }

  const trimmed = value.trim();
  if (!trimmed) {
    return null;
  }

  try {
    // Ensure the value is a valid absolute URL
    const url = new URL(trimmed);
    return url.toString().replace(/\/?$/, '');
  } catch (error) {
    return null;
  }
}

function normalizeBasePath(value?: string | null): string {
  if (!value) {
    return '';
  }

  const trimmed = value.trim();
  if (!trimmed) {
    return '';
  }

  const withoutLeading = trimmed.replace(/^\/+/, '');
  const withoutTrailing = withoutLeading.replace(/\/+$/, '');

  if (!withoutTrailing) {
    return '';
  }

  return `/${withoutTrailing}`;
}

const SITE_URL =
  normalizeUrl(process.env.NEXT_PUBLIC_SITE_URL) ?? 'https://spark.vincentke.cc';

const BASE_PATH = normalizeBasePath(process.env.NEXT_PUBLIC_BASE_PATH);
const DEFAULT_LOCALE_ENV = process.env.NEXT_PUBLIC_DEFAULT_LOCALE?.toLowerCase();

export function getSiteUrl(pathname?: string): string {
  if (!pathname) {
    return SITE_URL;
  }

  if (pathname.startsWith('http://') || pathname.startsWith('https://')) {
    return pathname;
  }

  const normalized = pathname.startsWith('/') ? pathname : `/${pathname}`;
  return `${SITE_URL}${normalized}`;
}

export function getBasePath(): string {
  return BASE_PATH;
}

export function getOgImageUrl(): string {
  return getSiteUrl('/og-cover.png');
}

export function getDefaultLocale(): SupportedLocale {
  if (!DEFAULT_LOCALE_ENV) {
    return 'en';
  }

  if (DEFAULT_LOCALE_ENV.startsWith('zh')) {
    return 'zh';
  }

  if (DEFAULT_LOCALE_ENV.startsWith('en')) {
    return 'en';
  }

  return 'en';
}
