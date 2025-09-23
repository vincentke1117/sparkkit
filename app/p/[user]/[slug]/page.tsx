import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { headers } from 'next/headers';

import { MarkdownRenderer } from '@/components/MarkdownRenderer';
import { OEmbedFrame } from '@/components/OEmbedFrame';
import { TagList } from '@/components/TagList';
import { formatDateReadable, getLocalizedList, getLocalizedText, resolveInitialLocale } from '@/lib/i18n';
import { fetchShowcaseByUserAndSlug } from '@/lib/supabase';
import { buildPenUrl } from '@/lib/url';

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
  const canonical = `https://sparkkit.dev/p/${record.pen_user}/${record.pen_slug}`;
  const image = record.thumbnail_url ?? 'https://sparkkit.dev/og-cover.png';
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

  const locale = resolveInitialLocale(headers().get('accept-language'));
  const title = getLocalizedText(record, 'title', locale) ?? `${record.pen_user}/${record.pen_slug}`;
  const summary = getLocalizedText(record, 'summary', locale);
  const headline = getLocalizedText(record, 'headline', locale);
  const body = getLocalizedText(record, 'body', locale);
  const reuseSteps = getLocalizedList(record, 'reuse_steps', locale);
  const keyPoints = getLocalizedList(record, 'key_points', locale);
  const perfNotes = getLocalizedText(record, 'perf', locale);
  const penUrl = buildPenUrl(record);
  const publishedAt = formatDateReadable(record.created_at ?? record.updated_at, locale);
  const canonical = `https://sparkkit.dev/p/${record.pen_user}/${record.pen_slug}`;
  const creativeWork = {
    '@type': 'CreativeWork',
    name: title,
    url: canonical,
    datePublished: record.created_at ?? undefined,
    dateModified: record.updated_at ?? undefined,
    description: summary ?? undefined,
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
        item: 'https://sparkkit.dev',
      },
      {
        '@type': 'ListItem',
        position: 2,
        name: '作品列表',
        item: 'https://sparkkit.dev/showcases',
      },
      {
        '@type': 'ListItem',
        position: 3,
        name: title,
        item: canonical,
      },
    ],
  };
  const jsonLd = {
    '@context': 'https://schema.org',
    '@graph': [creativeWork, breadcrumbs],
  };

  return (
    <div className="mx-auto flex w-full max-w-5xl flex-col gap-12 px-6 pb-24 pt-16 md:px-10">
      <script
        type="application/ld+json"
        suppressHydrationWarning
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <Link
        href="/showcases"
        className="focus-outline inline-flex w-fit items-center gap-2 rounded-full border border-white/20 px-4 py-2 text-xs uppercase tracking-wide text-white/60 hover:border-accent/60 hover:text-white"
      >
        ← 返回列表
      </Link>

      <header className="flex flex-col gap-6">
        <div className="flex flex-col gap-2">
          <h1 className="text-3xl font-semibold text-gradient md:text-4xl">{title}</h1>
          {summary ? <p className="max-w-2xl text-sm text-white/70">{summary}</p> : null}
        </div>
        <div className="flex flex-wrap items-center gap-4 text-xs text-white/60">
          <span>作者：{record.author_name ?? record.pen_user}</span>
          <a
            href={record.author_url ?? penUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="focus-outline inline-flex items-center gap-2 rounded-full border border-white/20 px-3 py-1 hover:border-accent/60 hover:text-white"
          >
            <span aria-hidden>↗</span>
            作者主页
          </a>
          <a
            href={penUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="neon-border focus-outline inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-1 text-white"
          >
            在 CodePen 打开
          </a>
          {publishedAt ? <time className="text-white/50" dateTime={record.created_at ?? undefined}>{publishedAt}</time> : null}
        </div>
        <TagList tags={record.tags ?? undefined} />
      </header>

      <section className="flex flex-col gap-6">
        {record.thumbnail_url ? (
          <div className="relative h-72 w-full overflow-hidden rounded-3xl">
            <Image
              src={record.thumbnail_url}
              alt={title}
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, 80vw"
              priority={false}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-black/10 to-transparent" aria-hidden />
          </div>
        ) : (
          <div className="flex h-72 items-center justify-center rounded-3xl border border-dashed border-white/20 bg-white/5 text-sm text-white/60">
            暂无缩略图，点击上方按钮在 CodePen 查看
          </div>
        )}
      </section>

      <section className="glass-panel flex flex-col gap-8 rounded-3xl p-8">
        {headline ? <h2 className="text-2xl font-semibold text-white">{headline}</h2> : null}

        {keyPoints.length > 0 ? (
          <div className="flex flex-col gap-3">
            <h3 className="text-lg font-semibold text-white">关键要点</h3>
            <ul className="list-disc space-y-2 pl-5 text-sm text-white/80">
              {keyPoints.map((point) => (
                <li key={point}>{point}</li>
              ))}
            </ul>
          </div>
        ) : null}

        {body ? (
          <div className="flex flex-col gap-3">
            <h3 className="text-lg font-semibold text-white">深入解读</h3>
            <MarkdownRenderer content={body} />
          </div>
        ) : (
          <div className="flex flex-col gap-3 text-white/70">
            <h3 className="text-lg font-semibold text-white">深入解读</h3>
            <p>这篇作品暂未提供详细解读。欢迎直接访问 CodePen 体验原作。</p>
          </div>
        )}

        {reuseSteps.length > 0 ? (
          <div className="flex flex-col gap-3">
            <h3 className="text-lg font-semibold text-white">复用步骤</h3>
            <ol className="list-decimal space-y-2 pl-5 text-sm text-white/80">
              {reuseSteps.map((step) => (
                <li key={step}>{step}</li>
              ))}
            </ol>
          </div>
        ) : null}

        {perfNotes ? (
          <div className="flex flex-col gap-3">
            <h3 className="text-lg font-semibold text-white">性能提示</h3>
            <p className="text-sm text-white/80">{perfNotes}</p>
          </div>
        ) : null}
      </section>

      {record.oembed_html ? (
        <section className="flex flex-col gap-4">
          <h2 className="text-xl font-semibold text-white">作品预览</h2>
          <OEmbedFrame html={record.oembed_html} />
        </section>
      ) : null}
    </div>
  );
}
