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
  className = 'h-44',
}: {
  record: ShowcaseRecord;
  alt: string;
  placeholder: string;
  className?: string;
}) {
  if (!record.thumbnail_url) {
    return (
      <div
        className={`flex ${className} w-full items-center justify-center rounded-2xl bg-gradient-to-br from-accent/20 to-accentSecondary/20 text-sm text-white/70`}
      >
        <span>{placeholder}</span>
      </div>
    );
  }

  return (
    <div className={`relative ${className} w-full overflow-hidden rounded-2xl`}>
      <Image
        src={record.thumbnail_url}
        alt={alt}
        fill
        className="object-cover transition-transform duration-500 group-hover:scale-[1.03]"
        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        priority={false}
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-black/10 to-transparent" aria-hidden />
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
    <article className="group relative flex h-full min-h-[24rem] flex-col overflow-hidden rounded-3xl border border-white/10 bg-slate-950/50 text-white shadow-lg transition duration-500 hover:-translate-y-1 hover:shadow-glow">
      <div className="absolute inset-0">
        <Thumbnail
          record={record}
          alt={title}
          placeholder={copy.cards.previewPlaceholder}
          className="h-full"
        />
      </div>

      <div className="relative flex h-full flex-col justify-end">
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/70 to-transparent" />

        <Link
          href={`/p/${record.pen_user}/${record.pen_slug}`}
          className="focus-outline relative flex flex-1 flex-col justify-end px-6 pt-24 pb-12"
        >
          <div className="flex flex-wrap items-center gap-3 text-[0.7rem] uppercase tracking-[0.2em] text-white/70">
            {record.stack ? (
              <span className="rounded-full border border-white/30 px-3 py-1 text-[0.65rem] font-semibold text-white/80">
                {record.stack}
              </span>
            ) : null}
            <span>{difficulty}</span>
            {publishedAt ? (
              <time dateTime={record.created_at ?? undefined} className="text-white/60">
                {publishedAt}
              </time>
            ) : null}
          </div>

          <h3 className="mt-4 text-2xl font-semibold leading-tight transition-transform duration-500 group-hover:-translate-y-1 group-focus-within:-translate-y-1">
            {title ?? copy.cards.untitled}
          </h3>

          {summary ? (
            <p className="mt-4 max-h-0 overflow-hidden text-sm leading-relaxed text-white/80 opacity-0 transition-all duration-500 group-focus-within:max-h-40 group-focus-within:opacity-100 group-hover:max-h-40 group-hover:opacity-100">
              {summary}
            </p>
          ) : null}

          <TagList
            tags={record.tags ?? undefined}
            className="mt-4 max-h-0 overflow-hidden opacity-0 transition-all duration-500 group-focus-within:max-h-24 group-focus-within:opacity-100 group-hover:max-h-24 group-hover:opacity-100"
          />
        </Link>

        <div className="relative flex items-center justify-between px-6 pb-6 text-sm text-white/80">
          <span className="font-medium text-white">{record.author_name ?? record.pen_user}</span>
          <a
            href={penUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="focus-outline inline-flex items-center gap-2 rounded-full border border-white/30 px-3 py-1 text-xs font-medium text-white/90 transition hover:border-white/60 hover:text-white"
          >
            <span aria-hidden>↗</span>
            <span>{copy.cards.openCodePen}</span>
          </a>
        </div>
      </div>
    </article>
  );
}
