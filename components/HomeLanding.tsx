'use client';

import { useMemo, useState } from 'react';
import Link from 'next/link';

import { GeoClock } from './GeoClock';
import { ShowcaseCard } from './ShowcaseCard';
import { useLanguage } from './LanguageProvider';
import { getUiCopy } from '@/lib/translations';
import type { ShowcaseRecord } from '@/lib/types';

const FEATURED_COUNT_PER_TIER = 3;
const DAILY_REFRESH_HOUR = 8; // 08:00 Beijing time

function normalizeDifficulty(value: string | null | undefined) {
  return value?.trim().toLowerCase() ?? '';
}

function hashString(input: string): number {
  let hash = 0;
  for (let index = 0; index < input.length; index += 1) {
    hash = (hash << 5) - hash + input.charCodeAt(index);
    hash |= 0; // Convert to 32-bit integer
  }
  return Math.abs(hash) + 1;
}

function createSeededRandom(seed: number) {
  let value = seed % 2147483647;
  if (value <= 0) {
    value += 2147483646;
  }
  return () => {
    value = (value * 16807) % 2147483647;
    return (value - 1) / 2147483646;
  };
}

function getBeijingCycleKey(reference: Date): string {
  const formatter = new Intl.DateTimeFormat('en-CA', {
    timeZone: 'Asia/Shanghai',
    hour12: false,
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
  });
  const parts = formatter.formatToParts(reference);
  const get = (type: Intl.DateTimeFormatPartTypes) => parts.find((part) => part.type === type)?.value ?? '0';

  let year = Number.parseInt(get('year'), 10);
  let month = Number.parseInt(get('month'), 10);
  let day = Number.parseInt(get('day'), 10);
  const hour = Number.parseInt(get('hour'), 10);

  if (Number.isNaN(year) || Number.isNaN(month) || Number.isNaN(day)) {
    return reference.toISOString().slice(0, 10);
  }

  if (!Number.isNaN(hour) && hour < DAILY_REFRESH_HOUR) {
    const previous = new Date(Date.UTC(year, month - 1, day));
    previous.setUTCDate(previous.getUTCDate() - 1);
    year = previous.getUTCFullYear();
    month = previous.getUTCMonth() + 1;
    day = previous.getUTCDate();
  }

  return `${year.toString().padStart(4, '0')}-${month.toString().padStart(2, '0')}-${day
    .toString()
    .padStart(2, '0')}`;
}

function selectDailyFeatured(records: ShowcaseRecord[]): ShowcaseRecord[] {
  if (records.length <= FEATURED_COUNT_PER_TIER * 2) {
    return records.slice(0, FEATURED_COUNT_PER_TIER * 2);
  }

  const cycleKey = getBeijingCycleKey(new Date());
  const random = createSeededRandom(hashString(cycleKey));
  const used = new Set<string>();

  const advancedPool = records.filter((record) => normalizeDifficulty(record.difficulty) === 'advanced');
  const intermediatePool = records.filter((record) => normalizeDifficulty(record.difficulty) === 'intermediate');

  const selections: ShowcaseRecord[] = [];

  function pickFromPool(pool: ShowcaseRecord[], count: number) {
    const candidates = pool.filter((item) => !used.has(item.id));
    while (candidates.length > 0 && selections.length < FEATURED_COUNT_PER_TIER * 2 && count > 0) {
      const index = Math.floor(random() * candidates.length);
      const [chosen] = candidates.splice(index, 1);
      if (!chosen) {
        break;
      }
      used.add(chosen.id);
      selections.push(chosen);
      count -= 1;
    }
  }

  pickFromPool(advancedPool, FEATURED_COUNT_PER_TIER);
  pickFromPool(intermediatePool, FEATURED_COUNT_PER_TIER);

  if (selections.length < FEATURED_COUNT_PER_TIER * 2) {
    const fallbackPool = records.filter((record) => !used.has(record.id));
    while (fallbackPool.length > 0 && selections.length < FEATURED_COUNT_PER_TIER * 2) {
      const index = Math.floor(random() * fallbackPool.length);
      const [chosen] = fallbackPool.splice(index, 1);
      if (!chosen) {
        break;
      }
      used.add(chosen.id);
      selections.push(chosen);
    }
  }

  const shuffled = [...selections];
  for (let i = shuffled.length - 1; i > 0; i -= 1) {
    const j = Math.floor(random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }

  return shuffled.slice(0, FEATURED_COUNT_PER_TIER * 2);
}

type HomeLandingProps = {
  showcases: ShowcaseRecord[];
  showDevNote?: boolean;
};

export function HomeLanding({ showcases, showDevNote = false }: HomeLandingProps) {
  const { locale } = useLanguage();
  const copy = getUiCopy(locale);
  const [expanded, setExpanded] = useState(false);

  const heroShowcases = useMemo(() => selectDailyFeatured(showcases), [showcases]);
  const galleryRecords = expanded ? showcases : heroShowcases;
  const canExpand = showcases.length > heroShowcases.length;

  return (
    <div className="relative mx-auto flex w-full max-w-7xl flex-col gap-16 px-6 pb-24 pt-20 md:px-10 lg:px-16">
      <section className="relative overflow-hidden rounded-[32px] border border-white/15 bg-white/5 px-8 py-16 shadow-[0_20px_60px_rgba(0,0,0,0.45)]">
        <div className="absolute -top-28 right-10 h-48 w-48 rounded-full bg-accent/40 blur-3xl" aria-hidden />
        <div className="absolute -bottom-20 left-10 h-60 w-60 rounded-full bg-accentSecondary/30 blur-[160px]" aria-hidden />
        <div className="relative z-10 flex flex-col gap-10 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex max-w-2xl flex-col gap-6">
            <span className="inline-flex items-center gap-3 text-xs uppercase tracking-[0.3em] text-white/60">
              sparkkit
              <span className="h-1 w-8 rounded-full bg-gradient-to-r from-accent to-accentSecondary" aria-hidden />
              {copy.landing.strapline}
            </span>
            <h1 className="text-4xl font-semibold leading-tight text-gradient sm:text-5xl">{copy.landing.heroTitle}</h1>
            <p className="max-w-xl text-base leading-relaxed text-white/80">{copy.landing.heroDescription}</p>
          <div className="flex flex-wrap items-center gap-4">
            <Link
              href="/showcases"
              className="neon-border focus-outline inline-flex items-center gap-2 rounded-full bg-white/10 px-6 py-3 text-sm font-medium text-white transition"
            >
              {copy.landing.directoryCta}
              <span aria-hidden>↗</span>
            </Link>
            <GeoClock />
          </div>
          </div>
          <div className="grid w-full max-w-md grid-cols-1 gap-4">
            {copy.landing.features.map((card) => (
              <div
                key={card.title}
                className="glass-panel focus-outline flex flex-col gap-3 rounded-3xl p-6 text-sm text-white/80 shadow-glow"
                tabIndex={0}
              >
                <h3 className="text-lg font-semibold text-white">{card.title}</h3>
                <p>{card.description}</p>
              </div>
            ))}
          </div>
        </div>
        {showDevNote ? (
          <aside className="mt-10 rounded-2xl border border-dashed border-white/20 bg-white/5 p-4 text-xs text-white/60" data-dev-note>
            <p>{copy.landing.devNote}</p>
          </aside>
        ) : null}
      </section>

      <section className="flex flex-col gap-6" id="gallery">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <h2 className="text-2xl font-semibold text-white">{copy.landing.featuredTitle}</h2>
            <p className="text-sm text-white/70">{copy.landing.featuredDescription}</p>
          </div>
          {canExpand ? (
            <button
              type="button"
              onClick={() => setExpanded((value) => !value)}
              className="focus-outline inline-flex items-center gap-2 rounded-full border border-white/20 px-4 py-2 text-xs uppercase tracking-wide text-white/70 hover:border-accent/70 hover:text-white"
            >
              {expanded ? copy.landing.collapse : copy.landing.viewAll}
            </button>
          ) : null}
        </div>

        {galleryRecords.length === 0 ? (
          <div className="glass-panel flex flex-col items-center gap-3 rounded-3xl p-12 text-center text-white/70">
            <h3 className="text-lg font-semibold text-white">SparkKit</h3>
            <p>{copy.landing.empty}</p>
          </div>
        ) : expanded ? (
          <div className="showcase-grid">
            {galleryRecords.map((showcase) => (
              <ShowcaseCard key={showcase.id} record={showcase} />
            ))}
          </div>
        ) : (
          <div className="showcase-grid">
            {galleryRecords.map((showcase) => (
              <ShowcaseCard key={showcase.id} record={showcase} />
            ))}
          </div>
        )}

        {expanded ? (
          <p className="text-center text-xs uppercase tracking-[0.3em] text-white/50">{copy.landing.masonryHint}</p>
        ) : null}
      </section>
    </div>
  );
}
