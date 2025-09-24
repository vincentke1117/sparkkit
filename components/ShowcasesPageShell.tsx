'use client';

import Link from 'next/link';

import { ShowcaseExplorer } from './ShowcaseExplorer';
import { useLanguage } from './LanguageProvider';
import { getUiCopy } from '@/lib/translations';
import type { ShowcaseRecord } from '@/lib/types';

type FilterOptions = {
  availableTags: string[];
  stacks: string[];
  difficulties: string[];
};

type ShowcasesPageShellProps = {
  initialRecords: ShowcaseRecord[];
  initialHasNext: boolean;
  filterOptions: FilterOptions;
};

export function ShowcasesPageShell({ initialRecords, initialHasNext, filterOptions }: ShowcasesPageShellProps) {
  const { locale } = useLanguage();
  const copy = getUiCopy(locale);

  return (
    <div className="mx-auto flex w-full max-w-7xl flex-col gap-10 px-6 pb-24 pt-16 md:px-10 lg:px-16">
      <header className="flex flex-col gap-4">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex flex-col gap-2">
            <p className="text-xs uppercase tracking-[0.3em] text-white/50">{copy.showcases.strapline}</p>
            <h1 className="text-3xl font-semibold text-white">{copy.showcases.title}</h1>
          </div>
          <Link
            href="/"
            className="focus-outline inline-flex items-center gap-2 rounded-full border border-white/20 px-4 py-2 text-xs uppercase tracking-wide text-white/70 transition hover:border-accent/70 hover:text-white"
          >
            {copy.showcases.returnHome}
          </Link>
        </div>
        <p className="max-w-2xl text-sm leading-relaxed text-white/70">{copy.showcases.description}</p>
      </header>

      <ShowcaseExplorer
        initialRecords={initialRecords}
        initialHasNext={initialHasNext}
        filterOptions={filterOptions}
      />
    </div>
  );
}
