'use client';

import { useMemo, useState } from 'react';
import Link from 'next/link';

import { GeoClock } from './GeoClock';
import { ShowcaseCard } from './ShowcaseCard';
import { useLanguage } from './LanguageProvider';
import { getUiCopy } from '@/lib/translations';
import type { ShowcaseRecord } from '@/lib/types';
import { selectDailyFeatured } from '@/lib/showcase-data';

type HomeLandingProps = {
  showcases: ShowcaseRecord[];
  showDevNote?: boolean;
};

export function HomeLanding({ showcases, showDevNote = false }: HomeLandingProps) {
  const { locale } = useLanguage();
  const copy = getUiCopy(locale);
  const [expanded, setExpanded] = useState(false);
  const localeQuery = locale === 'zh' ? 'hl=zh-cn' : 'hl=en';
  const directoryHref = `/showcases?${localeQuery}`;

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
              href={directoryHref}
              className="neon-border focus-outline inline-flex items-center gap-2 rounded-full bg-white/10 px-6 py-3 text-sm font-medium text-white transition"
            >
              {copy.landing.directoryCta}
              <span aria-hidden>↗</span>
            </Link>
            <Link
              href="/rss.xml"
              className="focus-outline inline-flex items-center gap-2 rounded-full border border-white/20 px-6 py-3 text-sm text-white/80 transition hover:border-accent/60 hover:text-white"
              target="_blank"
              rel="noopener noreferrer nofollow"
            >
              {copy.landing.rssCta}
              <span aria-hidden>🌀</span>
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
