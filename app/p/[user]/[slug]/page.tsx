import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { ShowcaseDetail } from '@/components/ShowcaseDetail';
import { getLocalizedText } from '@/lib/i18n';
import { fetchShowcaseByUserAndSlug, fetchShowcases } from '@/lib/supabase';
import { buildPenUrl } from '@/lib/url';
import { getOgImageUrl, getSiteUrl } from '@/lib/site';

export const revalidate = 600; // 10 minutes

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

  const title = getLocalizedText(record, 'title', 'zh') ?? `${record.pen_user}/${record.pen_slug}`;
  const summary =
    getLocalizedText(record, 'summary', 'zh') ?? 'Discover CodePen inspiration curated by SparkKit with bilingual insights.';
  const detailPath = `/p/${record.pen_user}/${record.pen_slug}`;
  const canonical = getSiteUrl(detailPath);
  const image = record.thumbnail_url ?? getOgImageUrl();
  const publishedTime = record.created_at ?? undefined;

  return {
    title,
    description: summary,
    alternates: {
      canonical,
      languages: {
        'en-US': canonical,
        'zh-CN': `${canonical}?hl=zh-cn`,
        'x-default': canonical,
      },
    },
    openGraph: {
      type: 'article',
      url: canonical,
      title,
      description: summary,
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
      title,
      description: summary,
      images: [image],
    },
  };
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

export async function generateStaticParams() {
  const showcases = await fetchShowcases({ limit: 5000 });
  return showcases.map((item) => ({ user: item.pen_user, slug: item.pen_slug }));
}
