'use client';

import Image from 'next/image';
import Link from 'next/link';

import { useLanguage } from './LanguageProvider';
import { MarkdownRenderer } from './MarkdownRenderer';
import { OEmbedFrame } from './OEmbedFrame';
import { TagList } from './TagList';
import { formatDateReadable, getLocalizedList, getLocalizedText } from '@/lib/i18n';
import { ShowcaseRecord } from '@/lib/types';
import { buildPenUrl } from '@/lib/url';

function SectionHeading({ title }: { title: string }) {
  return <h2 className="text-lg font-semibold text-white">{title}</h2>;
}

type ShowcaseDetailProps = {
  record: ShowcaseRecord;
  jsonLd: Record<string, unknown>;
  canonical: string;
};

export function ShowcaseDetail({ record, jsonLd, canonical }: ShowcaseDetailProps) {
  const { locale } = useLanguage();

  const title = getLocalizedText(record, 'title', locale) ?? `${record.pen_user}/${record.pen_slug}`;
  const summary = getLocalizedText(record, 'summary', locale);
  const headline = getLocalizedText(record, 'headline', locale);
  const body = getLocalizedText(record, 'body', locale);
  const reuseSteps = getLocalizedList(record, 'reuse_steps', locale);
  const keyPoints = getLocalizedList(record, 'key_points', locale);
  const perfNotes = getLocalizedText(record, 'perf', locale);
  const penUrl = buildPenUrl(record);
  const publishedAt = formatDateReadable(record.created_at ?? record.updated_at, locale);

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
            href={penUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="focus-outline inline-flex items-center gap-2 rounded-full border border-white/20 px-3 py-1 text-white/70 transition hover:border-accent/60 hover:text-white"
          >
            <span aria-hidden>↗</span>
            在 CodePen 打开
          </a>
          {publishedAt ? <time dateTime={record.created_at ?? record.updated_at ?? undefined}>发布：{publishedAt}</time> : null}
          {record.stack ? <span>Stack：{record.stack}</span> : null}
        </div>
        {record.thumbnail_url ? (
          <div className="relative aspect-video w-full overflow-hidden rounded-[32px] border border-white/15 bg-white/5">
            <Image src={record.thumbnail_url} alt={title} fill className="object-cover" sizes="100vw" />
          </div>
        ) : (
          <div className="flex aspect-video w-full items-center justify-center rounded-[32px] border border-dashed border-white/15 bg-white/5 text-sm text-white/60">
            缺少预览图，欢迎直接访问 CodePen 查看效果。
          </div>
        )}
      </header>

      <TagList tags={record.tags ?? undefined} />

      {headline ? (
        <section className="glass-panel flex flex-col gap-4 rounded-3xl p-6 text-sm text-white/80">
          <SectionHeading title="亮点解读" />
          <p>{headline}</p>
          {keyPoints && keyPoints.length > 0 ? (
            <ul className="grid gap-2">
              {keyPoints.map((point) => (
                <li key={point} className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3">
                  {point}
                </li>
              ))}
            </ul>
          ) : null}
        </section>
      ) : null}

      {body ? (
        <section className="glass-panel flex flex-col gap-4 rounded-3xl p-6 text-sm text-white/80">
          <SectionHeading title="深入分析" />
          <MarkdownRenderer content={body} />
        </section>
      ) : null}

      {reuseSteps && reuseSteps.length > 0 ? (
        <section className="glass-panel flex flex-col gap-4 rounded-3xl p-6 text-sm text-white/80">
          <SectionHeading title="复用步骤" />
          <ol className="grid gap-3">
            {reuseSteps.map((step, index) => (
              <li key={step} className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3">
                <span className="mr-3 inline-flex h-6 w-6 items-center justify-center rounded-full bg-accent/30 text-xs font-semibold text-white">
                  {index + 1}
                </span>
                {step}
              </li>
            ))}
          </ol>
        </section>
      ) : null}

      {perfNotes ? (
        <section className="glass-panel flex flex-col gap-4 rounded-3xl p-6 text-sm text-white/80">
          <SectionHeading title="性能观察" />
          <p>{perfNotes}</p>
        </section>
      ) : null}

      {record.oembed_html ? (
        <section className="glass-panel flex flex-col gap-4 rounded-3xl p-6 text-sm text-white/80">
          <SectionHeading title="作品预览" />
          <OEmbedFrame html={record.oembed_html} title={title} />
        </section>
      ) : null}

      {!headline && !body && (!reuseSteps || reuseSteps.length === 0) && !perfNotes ? (
        <section className="glass-panel flex flex-col gap-4 rounded-3xl p-6 text-sm text-white/80">
          <SectionHeading title="作品详情" />
          <p>暂未提供详细解读，可直接访问 CodePen 体验原作品。</p>
        </section>
      ) : null}

      <footer className="flex flex-wrap items-center justify-between gap-4 text-xs text-white/50">
        <span>原始链接：
          <a href={penUrl} target="_blank" rel="noopener noreferrer" className="ml-2 underline decoration-dotted decoration-white/40 underline-offset-4 hover:text-white">
            {penUrl}
          </a>
        </span>
        <span>
          Canonical：
          <a href={canonical} className="ml-1 underline decoration-dotted decoration-white/40 underline-offset-4 hover:text-white">
            {canonical}
          </a>
        </span>
      </footer>
    </div>
  );
}
