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
}: {
  record: ShowcaseRecord;
  alt: string;
  placeholder: string;
}) {
  if (!record.thumbnail_url) {
    return (
      <div className="flex h-44 w-full items-center justify-center rounded-2xl bg-gradient-to-br from-accent/20 to-accentSecondary/20 text-sm text-white/70">
        <span>{placeholder}</span>
      </div>
    );
  }

  return (
    <div className="relative h-44 w-full overflow-hidden rounded-2xl">
      <Image
        src={record.thumbnail_url}
        alt={alt}
        fill
        className="object-cover transition-transform duration-500 group-hover:scale-105"
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
    <article className="group flex h-full flex-col gap-4 overflow-hidden rounded-3xl border border-white/10 bg-white/5 p-4 text-white transition-shadow duration-500 card-hover">
      <Link
        href={`/p/${record.pen_user}/${record.pen_slug}`}
        className="focus-outline flex flex-1 flex-col gap-4"
      >
        <Thumbnail record={record} alt={title} placeholder={copy.cards.previewPlaceholder} />
        <h3 className="text-lg font-semibold text-gradient">{title ?? copy.cards.untitled}</h3>
      </Link>
      <div className="grid grid-rows-[0fr] transform transition-[grid-template-rows] duration-500 ease-out group-focus-within:grid-rows-[1fr] group-hover:grid-rows-[1fr]">
        <div className="overflow-hidden">
          <div className="flex flex-col gap-3 rounded-2xl border border-white/10 bg-black/40 p-4 text-sm text-white/80 transition-all duration-500 ease-out group-focus-within:translate-y-0 group-focus-within:opacity-100 group-hover:translate-y-0 group-hover:opacity-100 translate-y-4 opacity-0">
            <div className="flex items-center justify-between text-xs text-white/70">
              <span>{difficulty}</span>
              {publishedAt ? <time dateTime={record.created_at ?? undefined}>{publishedAt}</time> : null}
            </div>
            {summary ? <p className="leading-relaxed">{summary}</p> : null}
            <TagList tags={record.tags ?? undefined} />
          </div>
        </div>
      </div>
      <div className="mt-auto flex items-center justify-between pt-2 text-xs text-white/70">
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
