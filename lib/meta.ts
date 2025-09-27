import type { Metadata } from 'next';

import { getLocalizedText } from './i18n';
import type { ShowcaseRecord } from './types';
import { getOgImageUrl, getSiteUrl } from './site';

export const BRAND_NAME = '灵点集 · SparkKit';
export const DAILY_FEATURE_COUNT = 6;
const TWITTER_HANDLE = '@sparkkit';

export function createHomeMetadata(): Metadata {
  const title = `${BRAND_NAME} — 前端灵感与复用 | CodePen 精选解读`;
  const description = `每天 ${DAILY_FEATURE_COUNT} 条精选 CodePen 作品，配要点、复用步骤与性能提示。支持标签/难度/技术栈检索与官方嵌入，快速把灵感落地。`;
  const canonical = getSiteUrl('/');
  const ogImage = getOgImageUrl();

  return {
    title,
    description,
    alternates: {
      canonical,
      languages: {
        'zh-CN': canonical,
        'en-US': `${canonical}?hl=en`,
        'x-default': canonical,
      },
    },
    openGraph: {
      type: 'website',
      url: canonical,
      title,
      description,
      images: [
        {
          url: ogImage,
          width: 1200,
          height: 630,
          alt: title,
        },
      ],
      siteName: BRAND_NAME,
    },
    twitter: {
      card: 'summary_large_image',
      site: TWITTER_HANDLE,
      title,
      description,
      images: [ogImage],
    },
  };
}

export function createListMetadata(pathname = '/showcases'): Metadata {
  const title = `全部作品 · ${BRAND_NAME}`;
  const description = '搜索标题、摘要或解读；用标签、难度、技术栈与时间组合筛选，快速定位可复用的灵感。';
  const canonical = getSiteUrl(pathname);
  const ogImage = getOgImageUrl();

  return {
    title,
    description,
    alternates: {
      canonical,
      languages: {
        'zh-CN': canonical,
        'en-US': `${canonical}?hl=en`,
        'x-default': canonical,
      },
    },
    openGraph: {
      type: 'website',
      url: canonical,
      title,
      description,
      images: [
        {
          url: ogImage,
          width: 1200,
          height: 630,
          alt: title,
        },
      ],
      siteName: BRAND_NAME,
    },
    twitter: {
      card: 'summary_large_image',
      site: TWITTER_HANDLE,
      title,
      description,
      images: [ogImage],
    },
  };
}

export function createStatusMetadata(): Metadata {
  const title = `运行状态 · ${BRAND_NAME}`;
  const description = '查看 SparkKit 展示页的版本、最近同步时间与当前上线的作品数量。';
  const canonical = getSiteUrl('/status');
  const ogImage = getOgImageUrl();

  return {
    title,
    description,
    alternates: {
      canonical,
      languages: {
        'zh-CN': canonical,
        'en-US': `${canonical}?hl=en`,
        'x-default': canonical,
      },
    },
    openGraph: {
      type: 'website',
      url: canonical,
      title,
      description,
      images: [
        {
          url: ogImage,
          width: 1200,
          height: 630,
          alt: title,
        },
      ],
      siteName: BRAND_NAME,
    },
    twitter: {
      card: 'summary_large_image',
      site: TWITTER_HANDLE,
      title,
      description,
      images: [ogImage],
    },
  };
}

export function createDetailMetadata(record: ShowcaseRecord): Metadata {
  const zhTitle = getLocalizedText(record, 'title', 'zh');
  const enTitle = getLocalizedText(record, 'title', 'en');
  const title = zhTitle ?? enTitle ?? `${record.pen_user}/${record.pen_slug}`;
  const summaryZh = getLocalizedText(record, 'summary', 'zh');
  const summaryEn = getLocalizedText(record, 'summary', 'en');
  const description =
    summaryZh ?? summaryEn ?? '作者、要点、复用步骤与性能提示一应俱全，支持官方嵌入与标签检索。';
  const detailPath = `/p/${record.pen_user}/${record.pen_slug}`;
  const canonical = getSiteUrl(detailPath);
  const image = record.thumbnail_url ?? getOgImageUrl();
  const publishedTime = record.created_at ?? undefined;

  return {
    title: `${title} — 解读与复用要点 | ${BRAND_NAME}`,
    description,
    alternates: {
      canonical,
      languages: {
        'zh-CN': canonical,
        'en-US': `${canonical}?hl=en`,
        'x-default': canonical,
      },
    },
    openGraph: {
      type: 'article',
      url: canonical,
      title: `${title} — Analysis & Reuse Notes | ${BRAND_NAME}`,
      description,
      images: [
        {
          url: image,
          width: 1200,
          height: 630,
          alt: title,
        },
      ],
      authors: record.author_name ? [record.author_name] : undefined,
      publishedTime,
      tags: record.tags ?? undefined,
    },
    twitter: {
      card: 'summary_large_image',
      site: TWITTER_HANDLE,
      title: `${title} — Analysis & Reuse Notes`,
      description,
      images: [image],
    },
  };
}
