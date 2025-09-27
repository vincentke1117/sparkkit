import type { Metadata } from 'next';
import { notFound } from 'next/navigation';

import { ShowcaseDetail } from '@/components/ShowcaseDetail';
import { getLocalizedText } from '@/lib/i18n';
import { createDetailMetadata } from '@/lib/meta';
import { fetchShowcaseByUserAndSlug, fetchShowcases } from '@/lib/supabase';
import { buildPenUrl } from '@/lib/url';
import { getSiteUrl } from '@/lib/site';

export const dynamicParams = false;

type Params = {
  user: string;
  slug: string;
};

export async function generateMetadata({ params }: { params: Params }): Promise<Metadata> {
  const record = await fetchShowcaseByUserAndSlug(params.user, params.slug);
  if (!record) {
    return {
      title: '未找到作品',
      description: '请返回列表查看其他作品。',
    };
  }

  return createDetailMetadata(record);
}

export default async function ShowcaseDetailPage({ params }: { params: Params }) {
  const record = await fetchShowcaseByUserAndSlug(params.user, params.slug);

  if (!record) {
    notFound();
  }

  const canonical = getSiteUrl(`/p/${record.pen_user}/${record.pen_slug}`);
  const penUrl = buildPenUrl(record);
  const creativeWork = {
    '@type': 'CreativeWork',
    name:
      getLocalizedText(record, 'title', 'zh') ??
      getLocalizedText(record, 'title', 'en') ??
      `${record.pen_user}/${record.pen_slug}`,
    url: canonical,
    datePublished: record.created_at ?? undefined,
    dateModified: record.updated_at ?? undefined,
    description:
      getLocalizedText(record, 'summary', 'zh') ??
      getLocalizedText(record, 'summary', 'en') ??
      undefined,
    image: record.thumbnail_url ?? undefined,
    sameAs: [penUrl],
    author: record.author_name
      ? {
          '@type': 'Person',
          name: record.author_name,
          url: record.author_url ?? penUrl,
        }
      : undefined,
    keywords: record.tags ?? undefined,
    citation: [
      {
        '@type': 'CreativeWork',
        url: penUrl,
        name: 'Original CodePen',
      },
    ],
  };
  const breadcrumbs = {
    '@type': 'BreadcrumbList',
    itemListElement: [
      {
        '@type': 'ListItem',
        position: 1,
        name: '首页',
        item: getSiteUrl(),
      },
      {
        '@type': 'ListItem',
        position: 2,
        name: '作品列表',
        item: getSiteUrl('/showcases'),
      },
      {
        '@type': 'ListItem',
        position: 3,
        name:
          getLocalizedText(record, 'title', 'zh') ??
          getLocalizedText(record, 'title', 'en') ??
          `${record.pen_user}/${record.pen_slug}`,
        item: canonical,
      },
    ],
  };
  const jsonLd = {
    '@context': 'https://schema.org',
    '@graph': [creativeWork, breadcrumbs],
  };

  return <ShowcaseDetail record={record} jsonLd={jsonLd} canonical={canonical} />;
}

export const generateStaticParams = async (): Promise<Params[]> => {
  const showcases = await fetchShowcases({ limit: 5000 });
  if (showcases.length === 0) {
    return [{ user: 'placeholder', slug: 'placeholder' }];
  }

  return showcases.map((item) => ({ user: item.pen_user, slug: item.pen_slug }));
};
