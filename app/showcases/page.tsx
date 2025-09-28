import { Suspense } from 'react';
import type { Metadata } from 'next';

import { ShowcaseExplorerFallback } from '@/components/ShowcaseExplorer';
import { PAGE_SIZE } from '@/components/ShowcaseFilters';
import { ShowcasesPageShell } from '@/components/ShowcasesPageShell';
import { createListMetadata } from '@/lib/meta';
import { fetchDistinctFilters, fetchShowcases } from '@/lib/supabase';

export const revalidate = 900; // 15 minutes

export const metadata: Metadata = createListMetadata('/showcases');

export default async function ShowcasesPage() {
  const [showcasesRaw, filters] = await Promise.all([
    fetchShowcases({ limit: PAGE_SIZE + 1, order: 'latest' }),
    fetchDistinctFilters(),
  ]);

  const showcases = showcasesRaw.slice(0, PAGE_SIZE);
  const hasNext = showcasesRaw.length > PAGE_SIZE;

  return (
    <Suspense
      fallback={
        <ShowcaseExplorerFallback filterOptions={{ availableTags: filters.tags, stacks: filters.stacks, difficulties: filters.difficulties }} />
      }
    >
      <ShowcasesPageShell
        initialRecords={showcases}
        initialHasNext={hasNext}
        filterOptions={{ availableTags: filters.tags, stacks: filters.stacks, difficulties: filters.difficulties }}
      />
    </Suspense>
  );
}
