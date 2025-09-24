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
    <article className="group flex h-full flex-col justify-between gap-4 overflow-hidden rounded-3xl border border-white/10 bg-white/5 p-4 text-white transition-shadow duration-500 card-hover">
      <Link
        href={`/p/${record.pen_user}/${record.pen_slug}`}
        className="focus-outline relative flex flex-1 flex-col"
      >
        <div className="relative h-full overflow-hidden rounded-2xl">
          <Thumbnail
            record={record}
            alt={title}
            placeholder={copy.cards.previewPlaceholder}
            className="h-60"
          />
          <div
            className="absolute inset-x-4 bottom-4 z-10 transition-all duration-500 ease-out [transform:translateY(calc(100%-6.5rem))] group-focus-within:[transform:translateY(0)] group-hover:[transform:translateY(0)]"
          >
            <div className="rounded-2xl bg-white/95 p-5 text-sm text-slate-700 shadow-2xl shadow-black/40 backdrop-blur">
              <div className="flex items-center justify-between text-[0.7rem] uppercase tracking-wide text-slate-500">
                <span>{difficulty}</span>
                {publishedAt ? (
                  <time dateTime={record.created_at ?? undefined}>{publishedAt}</time>
                ) : null}
              </div>
              <h3 className="mt-3 text-lg font-semibold text-slate-900 transition-transform duration-500 group-hover:-translate-y-1 group-focus-within:-translate-y-1">
                {title ?? copy.cards.untitled}
              </h3>
              {summary ? (
                <p className="mt-3 translate-y-4 text-sm leading-relaxed text-slate-600 opacity-0 transition-all duration-500 group-focus-within:translate-y-0 group-focus-within:opacity-100 group-hover:translate-y-0 group-hover:opacity-100">
                  {summary}
                </p>
              ) : null}
              <TagList
                tags={record.tags ?? undefined}
                variant="light"
                className="mt-4 translate-y-4 opacity-0 transition-all duration-500 group-focus-within:translate-y-0 group-focus-within:opacity-100 group-hover:translate-y-0 group-hover:opacity-100"
              />
            </div>
          </div>
        </div>
      </Link>
      <div className="flex items-center justify-between text-xs text-white/70">
        <span className="text-sm font-medium text-white/90">{record.author_name ?? record.pen_user}</span>
        <a
          href={penUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="focus-outline neon-border inline-flex items-center gap-2 rounded-full border border-white/20 px-3 py-1 text-xs text-white/90 transition"
        >
          <span aria-hidden>↗</span>
          <span>{copy.cards.openCodePen}</span>
        </a>
      </div>
    </article>
  );
}
