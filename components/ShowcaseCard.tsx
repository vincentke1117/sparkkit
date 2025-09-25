'use client';

import Image from 'next/image';
import Link from 'next/link';

import { formatDateReadable, getLocalizedText } from '@/lib/i18n';
import { buildPenUrl } from '@/lib/url';
import { ShowcaseRecord } from '@/lib/types';
import { getUiCopy } from '@/lib/translations';

import { useLanguage } from './LanguageProvider';
import { TagList } from './TagList';

function Thumbnail({
  record,
  alt,
  placeholder,
  className = 'aspect-[16/10]',
}: {
  record: ShowcaseRecord;
  alt: string;
  placeholder: string;
  className?: string;
}) {
  if (!record.thumbnail_url) {
    return (
      <div
        className={`flex ${className} w-full items-center justify-center overflow-hidden rounded-3xl bg-gradient-to-br from-accent/20 to-accentSecondary/20 text-sm text-white/70`}
      >
        <span className="px-6 text-center leading-relaxed">{placeholder}</span>
      </div>
    );
  }

  return (
    <div
      className={`relative ${className} w-full overflow-hidden rounded-3xl border border-white/10 bg-slate-900/40 shadow-[inset_0_0_40px_rgba(255,255,255,0.04)]`}
    >
      <Image
        src={record.thumbnail_url}
        alt={alt}
        fill
        className="object-contain transition-transform duration-500 group-hover:scale-[1.02]"
        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        priority={false}
      />
    </div>
  );
}

export function ShowcaseCard({ record }: { record: ShowcaseRecord }) {
  const { locale } = useLanguage();
  const copy = getUiCopy(locale);
  const title = getLocalizedText(record, 'title', locale) ?? copy.cards.untitled;
  const summary = getLocalizedText(record, 'summary', locale);
  const publishedAt = formatDateReadable(record.created_at, locale);
  const penUrl = buildPenUrl(record);
  const difficulty = record.difficulty ?? copy.cards.difficultyFallback;

  return (
    <article className="group relative isolate flex h-full flex-col overflow-hidden rounded-3xl border border-white/10 bg-slate-950/60 text-white shadow-lg transition duration-500 hover:-translate-y-1 hover:shadow-glow">
      <Thumbnail
        record={record}
        alt={title}
        placeholder={copy.cards.previewPlaceholder}
      />

      <div className="pointer-events-none absolute inset-x-0 bottom-0 translate-y-[calc(100%-10rem)] overflow-hidden rounded-t-3xl bg-gradient-to-t from-slate-950/95 via-slate-950/80 to-slate-950/30 backdrop-blur-lg transition-transform duration-500 group-focus-within:translate-y-0 group-hover:translate-y-0">
        <div className="pointer-events-auto flex flex-col gap-6 px-6 pb-6 pt-8">
          <div className="flex flex-col gap-3 text-sm text-white/75">
            <div className="flex flex-wrap items-center gap-3 text-[0.65rem] uppercase tracking-[0.2em] text-white/60">
              {record.stack ? (
                <span className="rounded-full border border-white/20 px-3 py-1 text-[0.6rem] font-semibold text-white/80">
                  {record.stack}
                </span>
              ) : null}
              <span className="text-white/70">{difficulty}</span>
              {publishedAt ? (
                <time dateTime={record.created_at ?? undefined} className="text-white/50">
                  {publishedAt}
                </time>
              ) : null}
            </div>
            {summary ? <p className="leading-relaxed text-white/80">{summary}</p> : null}
            <TagList
              tags={record.tags ?? undefined}
              className="text-xs text-white/70"
            />
          </div>

          <div className="flex flex-col gap-3 border-t border-white/10 pt-4">
            <div className="flex items-start justify-between gap-4">
              <Link
                href={`/p/${record.pen_user}/${record.pen_slug}`}
                className="focus-outline block text-left"
              >
                <h3 className="text-2xl font-semibold leading-tight">{title ?? copy.cards.untitled}</h3>
              </Link>
              <a
                href={penUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="focus-outline inline-flex shrink-0 items-center gap-2 rounded-full border border-white/30 px-3 py-1 text-xs font-medium text-white/90 transition hover:border-white/60 hover:text-white"
              >
                <span aria-hidden>↗</span>
                <span>{copy.cards.openCodePen}</span>
              </a>
            </div>
            <span className="text-sm font-medium text-white/80">{record.author_name ?? record.pen_user}</span>
          </div>
        </div>
      </div>
    </article>
  );
}
