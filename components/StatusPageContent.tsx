'use client';

import { useMemo } from 'react';

import { useLanguage } from './LanguageProvider';
import { getUiCopy } from '@/lib/translations';
import { formatDateReadable } from '@/lib/i18n';
import type { SyncStatus } from '@/lib/types';

type StatusPageContentProps = {
  status: SyncStatus;
};

export function StatusPageContent({ status }: StatusPageContentProps) {
  const { locale } = useLanguage();
  const copy = getUiCopy(locale);
  const syncedAt = useMemo(() => formatDateReadable(status.lastSyncedAt, locale), [status.lastSyncedAt, locale]);
  const cacheHit = status.cacheHitRate !== undefined && status.cacheHitRate !== null
    ? `${Math.round(status.cacheHitRate * 100)}%`
    : copy.status.cachePending;

  return (
    <div className="mx-auto flex w-full max-w-4xl flex-col gap-12 px-6 pb-24 pt-16 md:px-10">
      <header className="flex flex-col gap-3">
        <p className="text-xs uppercase tracking-[0.3em] text-white/50">{copy.status.strapline}</p>
        <h1 className="text-3xl font-semibold text-white">{copy.status.title}</h1>
        <p className="max-w-2xl text-sm text-white/70">{copy.status.description}</p>
      </header>

      <section className="grid gap-6 md:grid-cols-3">
        <div className="glass-panel flex flex-col gap-2 rounded-3xl p-6 text-white/80">
          <span className="text-xs uppercase tracking-widest text-white/50">{copy.status.metrics.versionLabel}</span>
          <span className="text-2xl font-semibold text-white">{status.version}</span>
          <p className="text-xs text-white/60">{copy.status.metrics.versionHint}</p>
        </div>
        <div className="glass-panel flex flex-col gap-2 rounded-3xl p-6 text-white/80">
          <span className="text-xs uppercase tracking-widest text-white/50">{copy.status.metrics.syncLabel}</span>
          <span className="text-2xl font-semibold text-white">{syncedAt ?? '—'}</span>
          <p className="text-xs text-white/60">{copy.status.metrics.syncHint}</p>
        </div>
        <div className="glass-panel flex flex-col gap-2 rounded-3xl p-6 text-white/80">
          <span className="text-xs uppercase tracking-widest text-white/50">{copy.status.metrics.indexedLabel}</span>
          <span className="text-2xl font-semibold text-white">{status.totalIndexed.toLocaleString()}</span>
          <p className="text-xs text-white/60">{copy.status.metrics.indexedHint}</p>
        </div>
      </section>

      <section className="glass-panel flex flex-col gap-4 rounded-3xl p-8 text-sm text-white/80">
        <h2 className="text-xl font-semibold text-white">{copy.status.cacheTitle}</h2>
        <p>{copy.status.cacheBody}</p>
        <div className="flex flex-wrap gap-3 text-xs text-white/60">
          <span className="rounded-full border border-white/20 px-3 py-1">
            {copy.status.cacheHitLabel}：{cacheHit}
          </span>
          <span className="rounded-full border border-white/20 px-3 py-1">{copy.status.revalidateProtected}</span>
          <span className="rounded-full border border-white/20 px-3 py-1">{copy.status.cronCadence}</span>
        </div>
      </section>
    </div>
  );
}
