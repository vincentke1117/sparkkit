'use client';

import { useEffect, useMemo, useState } from 'react';
import { useSearchParams } from 'next/navigation';

import { ShowcaseCard } from './ShowcaseCard';
import { ShowcaseFilters, PAGE_SIZE } from './ShowcaseFilters';
import { PaginationControls } from './PaginationControls';
import { fetchShowcasesClient } from '@/lib/supabase-browser';
import type { ShowcaseFilters as ShowcaseFilterInput, ShowcaseRecord } from '@/lib/types';
import { getUiCopy } from '@/lib/translations';
import { useLanguage } from './LanguageProvider';

type FilterOptions = {
  availableTags: string[];
  stacks: string[];
  difficulties: string[];
};

type State = {
  records: ShowcaseRecord[];
  hasNext: boolean;
  loading: boolean;
};

type Props = {
  initialRecords: ShowcaseRecord[];
  initialHasNext: boolean;
  filterOptions: FilterOptions;
  pageSize?: number;
};

function parseSearchParams(searchParams: URLSearchParams, pageSize: number): ShowcaseFilterInput {
  const page = Number.parseInt(searchParams.get('page') ?? '1', 10);
  const normalizedPage = Number.isNaN(page) || page < 1 ? 1 : page;
  const offset = (normalizedPage - 1) * pageSize;
  const tags = searchParams.getAll('tags');
  const query = searchParams.get('q') ?? undefined;
  const stack = searchParams.get('stack') ?? undefined;
  const difficulty = searchParams.get('difficulty') ?? undefined;

  return {
    query,
    tags,
    stack: stack || undefined,
    difficulty: difficulty || undefined,
    limit: pageSize + 1,
    offset,
  };
}

export function ShowcaseExplorer({
  initialRecords,
  initialHasNext,
  filterOptions,
  pageSize = PAGE_SIZE,
}: Props) {
  const searchParams = useSearchParams();
  const { locale } = useLanguage();
  const copy = getUiCopy(locale);
  const [state, setState] = useState<State>({
    records: initialRecords,
    hasNext: initialHasNext,
    loading: false,
  });

  const page = useMemo(() => {
    const value = Number.parseInt(searchParams.get('page') ?? '1', 10);
    if (Number.isNaN(value) || value < 1) {
      return 1;
    }
    return value;
  }, [searchParams]);

  useEffect(() => {
    const filters = parseSearchParams(searchParams, pageSize);

    let cancelled = false;
    setState((prev) => ({ ...prev, loading: true }));

    fetchShowcasesClient(filters)
      .then((data) => {
        if (cancelled) {
          return;
        }
        const records = data.slice(0, pageSize);
        const hasNext = data.length > pageSize;
        setState({ records, hasNext, loading: false });
      })
      .catch(() => {
        if (cancelled) {
          return;
        }
        setState({ records: initialRecords, hasNext: initialHasNext, loading: false });
      });

    return () => {
      cancelled = true;
    };
  }, [searchParams, pageSize, initialRecords, initialHasNext]);

  const skeletonCards = useMemo(
    () =>
      Array.from({ length: pageSize }).map((_, index) => (
        <div
          key={`skeleton-${index}`}
          className="glass-panel flex h-40 flex-col justify-center gap-3 rounded-3xl p-6 text-sm text-white/40"
        >
          <div className="h-4 w-32 rounded-full bg-white/10" />
          <div className="h-3 w-full rounded-full bg-white/5" />
          <div className="h-3 w-3/4 rounded-full bg-white/5" />
        </div>
      )),
    [pageSize],
  );

  return (
    <div className="grid gap-8 lg:grid-cols-[260px,1fr] lg:items-start xl:gap-12">
      <ShowcaseFilters
        availableTags={filterOptions.availableTags}
        stacks={filterOptions.stacks}
        difficulties={filterOptions.difficulties}
      />

      <section className="flex flex-col gap-6">
        {state.loading ? (
          <div className="showcase-grid" aria-live="polite" aria-busy="true">
            {skeletonCards}
          </div>
        ) : state.records.length === 0 ? (
          <div className="glass-panel flex flex-col items-center gap-3 rounded-3xl p-12 text-center text-white/70">
            <h2 className="text-lg font-semibold text-white">{copy.explorer.noResultsTitle}</h2>
            <p>{copy.explorer.noResultsBody}</p>
          </div>
        ) : (
          <>
            <div className="showcase-grid">
              {state.records.map((showcase) => (
                <ShowcaseCard key={showcase.id} record={showcase} />
              ))}
            </div>
            <PaginationControls hasNext={state.hasNext} currentPage={page} isLoading={state.loading} />
          </>
        )}
      </section>
    </div>
  );
}

type FallbackProps = {
  pageSize?: number;
  filterOptions?: FilterOptions;
};

export function ShowcaseExplorerFallback({ pageSize = PAGE_SIZE }: FallbackProps) {
  return (
    <div className="grid gap-8 lg:grid-cols-[260px,1fr] lg:items-start xl:gap-12">
      <div className="glass-panel flex flex-col gap-4 rounded-3xl p-6 text-sm text-white/60 lg:sticky lg:top-24">
        <div className="h-4 w-24 rounded-full bg-white/10" />
        <div className="h-10 rounded-2xl bg-white/5" />
        <div className="h-10 rounded-2xl bg-white/5" />
        <div className="h-10 rounded-2xl bg-white/5" />
      </div>

      <section className="flex flex-col gap-6">
        <div className="showcase-grid">
          {Array.from({ length: pageSize }).map((_, index) => (
            <div
              key={`fallback-${index}`}
              className="glass-panel flex flex-col gap-3 rounded-3xl p-6 text-sm text-white/40"
            >
              <div className="h-44 w-full rounded-2xl bg-white/5" />
              <div className="h-4 w-3/4 rounded-full bg-white/10" />
              <div className="h-3 w-full rounded-full bg-white/5" />
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
