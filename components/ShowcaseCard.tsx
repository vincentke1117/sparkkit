'use client';

import { useCallback, useMemo, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';

import { formatDateReadable, formatRelativeTime, getLocalizedText } from '@/lib/i18n';
import { buildPenUrl } from '@/lib/url';
import { ShowcaseRecord } from '@/lib/types';
import { getUiCopy } from '@/lib/translations';
import { getSiteUrl } from '@/lib/site';

import { useLanguage } from './LanguageProvider';
import { TagList } from './TagList';

type ThumbnailProps = {
  record: ShowcaseRecord;
  alt: string;
  placeholder: string;
  dayLabel?: string;
  monthLabel?: string;
  yearLabel?: string;
};

function Thumbnail({ record, alt, placeholder, dayLabel, monthLabel, yearLabel }: ThumbnailProps) {
  const hasImage = Boolean(record.thumbnail_url);
  const showBadge = Boolean(dayLabel && monthLabel);

  return (
    <div className="showcase-card__thumbnail">
      {showBadge ? (
        <div className="showcase-card__date" aria-hidden>
          {yearLabel ? <span className="year">{yearLabel}</span> : null}
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
  const yearFormatter = new Intl.DateTimeFormat(badgeLocale, {
    year: 'numeric',
    timeZone: 'Asia/Shanghai',
  });

  const day = dayFormatter.format(date);
  const monthRaw = monthFormatter.format(date);
  const month = badgeLocale === 'en-US' ? monthRaw.toUpperCase() : monthRaw;
  const year = yearFormatter.format(date);

  return { day, month, year };
}

export function ShowcaseCard({ record }: { record: ShowcaseRecord }) {
  const { locale } = useLanguage();
  const copy = getUiCopy(locale);
  const title = getLocalizedText(record, 'title', locale) ?? copy.cards.untitled;
  const summary = getLocalizedText(record, 'summary', locale);
  const publishedAt = formatDateReadable(record.created_at, locale);
  const relativePublished = formatRelativeTime(record.created_at, locale);
  const penUrl = buildPenUrl(record);
  const difficulty = record.difficulty ?? copy.cards.difficultyFallback;
  const stackLabel = record.stack ?? copy.cards.stackFallback;
  const author = record.author_name ?? record.pen_user;
  const detailLabel = locale.startsWith('zh') ? '阅读解读' : 'Read analysis';
  const localeQuery = locale.startsWith('zh') ? 'hl=zh-cn' : 'hl=en';
  const detailPath = `/p/${record.pen_user}/${record.pen_slug}/`;
  const detailHref = `${detailPath}?${localeQuery}`;

  const [copied, setCopied] = useState(false);

  const copyLink = useCallback(async () => {
    try {
      const targetUrl = getSiteUrl(detailHref);
      if (navigator.clipboard && navigator.clipboard.writeText) {
        await navigator.clipboard.writeText(targetUrl);
      } else {
        const textarea = document.createElement('textarea');
        textarea.value = targetUrl;
        textarea.setAttribute('readonly', '');
        textarea.style.position = 'absolute';
        textarea.style.left = '-9999px';
        document.body.appendChild(textarea);
        textarea.select();
        document.execCommand('copy');
        document.body.removeChild(textarea);
      }
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      console.error('[SparkKit] Failed to copy showcase link', error);
    }
  }, [detailHref]);

  const timeAriaLabel = useMemo(() => {
    if (!publishedAt) {
      return undefined;
    }
    if (relativePublished) {
      return `${publishedAt} · ${relativePublished}`;
    }
    return publishedAt;
  }, [publishedAt, relativePublished]);

  const badge = getBadgeParts(record.created_at, locale);

  return (
    <article className="showcase-card group mx-auto">
      <Thumbnail
        record={record}
        alt={title}
        placeholder={copy.cards.previewPlaceholder}
        dayLabel={badge?.day}
        monthLabel={badge?.month}
        yearLabel={badge?.year}
      />

      <div className="showcase-card__content">
        <span className="showcase-card__category">{stackLabel}</span>

        <Link href={detailHref} className="showcase-card__title focus-outline">
          {title}
        </Link>

        <p className="showcase-card__subtitle">{author}</p>

        <div className="showcase-card__details">
          {summary ? <p className="showcase-card__description">{summary}</p> : null}

          <div className="showcase-card__meta">
            <span>{difficulty}</span>
            {publishedAt ? (
              <time
                dateTime={record.created_at ?? undefined}
                title={relativePublished ?? undefined}
                aria-label={timeAriaLabel}
              >
                {publishedAt}
              </time>
            ) : null}
            {relativePublished ? <span className="showcase-card__relative">{relativePublished}</span> : null}
          </div>

          <TagList tags={record.tags ?? undefined} className="showcase-card__tags" />
        </div>

        <div className="showcase-card__actions">
          <Link href={detailHref} className="showcase-card__action focus-outline">
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
          <button
            type="button"
            onClick={copyLink}
            className="showcase-card__action focus-outline"
          >
            {copied ? copy.cards.copySuccess : copy.cards.copyLink}
          </button>
        </div>
        <span className="sr-only" aria-live="polite">
          {copied ? copy.cards.copySuccess : ''}
        </span>
      </div>
    </article>
  );
}
