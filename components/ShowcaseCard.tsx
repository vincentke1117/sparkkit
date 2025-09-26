'use client';

import Image from 'next/image';
import Link from 'next/link';

import { formatDateReadable, getLocalizedText } from '@/lib/i18n';
import { buildPenUrl } from '@/lib/url';
import { ShowcaseRecord } from '@/lib/types';
import { getUiCopy } from '@/lib/translations';

import { useLanguage } from './LanguageProvider';
import { TagList } from './TagList';

type ThumbnailProps = {
  record: ShowcaseRecord;
  alt: string;
  placeholder: string;
  dayLabel?: string;
  monthLabel?: string;
};

function Thumbnail({ record, alt, placeholder, dayLabel, monthLabel }: ThumbnailProps) {
  const hasImage = Boolean(record.thumbnail_url);
  const showBadge = Boolean(dayLabel && monthLabel);

  return (
    <div className="showcase-card__thumbnail">
      {showBadge ? (
        <div className="showcase-card__date" aria-hidden>
          <span className="day">{dayLabel}</span>
          <span className="month">{monthLabel}</span>
        </div>
      ) : null}
      {hasImage ? (
        <Image
          src={record.thumbnail_url!}
          alt={alt}
          fill
          sizes="(max-width: 768px) 90vw, (max-width: 1280px) 300px, 300px"
          className="showcase-card__image"
          priority={false}
        />
      ) : (
        <div className="showcase-card__placeholder">
          <span>{placeholder}</span>
        </div>
      )}
    </div>
  );
}

function getBadgeParts(createdAt: string | null | undefined, locale: string) {
  if (!createdAt) {
    return undefined;
  }

  const date = new Date(createdAt);
  if (Number.isNaN(date.getTime())) {
    return undefined;
  }

  const badgeLocale = locale.startsWith('zh') ? 'zh-CN' : 'en-US';

  const dayFormatter = new Intl.DateTimeFormat(badgeLocale, {
    day: '2-digit',
    timeZone: 'Asia/Shanghai',
  });
  const monthFormatter = new Intl.DateTimeFormat(badgeLocale, {
    month: 'short',
    timeZone: 'Asia/Shanghai',
  });

  const day = dayFormatter.format(date);
  const monthRaw = monthFormatter.format(date);
  const month = badgeLocale === 'en-US' ? monthRaw.toUpperCase() : monthRaw;

  return { day, month };
}


export function ShowcaseCard({ record }: { record: ShowcaseRecord }) {
  const { locale } = useLanguage();
  const copy = getUiCopy(locale);
  const title = getLocalizedText(record, 'title', locale) ?? copy.cards.untitled;
  const summary = getLocalizedText(record, 'summary', locale);
  const publishedAt = formatDateReadable(record.created_at, locale);
  const penUrl = buildPenUrl(record);
  const difficulty = record.difficulty ?? copy.cards.difficultyFallback;
  const stackLabel = record.stack ?? copy.cards.stackFallback;
  const author = record.author_name ?? record.pen_user;
  const detailLabel = locale.startsWith('zh') ? '查看解读' : 'View analysis';

  const badge = getBadgeParts(record.created_at, locale);

  return (
    <article className="showcase-card group mx-auto">
      <Thumbnail
        record={record}
        alt={title}
        placeholder={copy.cards.previewPlaceholder}
        dayLabel={badge?.day}
        monthLabel={badge?.month}
      />

      <div className="showcase-card__content">
        <span className="showcase-card__category">{stackLabel}</span>

        <Link href={`/p/${record.pen_user}/${record.pen_slug}`} className="showcase-card__title focus-outline">
          {title}
        </Link>

        <p className="showcase-card__subtitle">{author}</p>

        <div className="showcase-card__details">
          {summary ? <p className="showcase-card__description">{summary}</p> : null}

          <div className="showcase-card__meta">
            <span>{difficulty}</span>
            {publishedAt ? (
              <time dateTime={record.created_at ?? undefined}>{publishedAt}</time>
            ) : null}
          </div>

          <TagList tags={record.tags ?? undefined} className="showcase-card__tags" />
        </div>

        <div className="showcase-card__actions">
          <Link
            href={`/p/${record.pen_user}/${record.pen_slug}`}
            className="showcase-card__action focus-outline"
          >
            {detailLabel}
          </Link>
          <a
            href={penUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="showcase-card__action showcase-card__action--external focus-outline"
          >
            <span aria-hidden>↗</span>
            <span>{copy.cards.openCodePen}</span>
          </a>
        </div>
      </div>
    </article>
  );
}
