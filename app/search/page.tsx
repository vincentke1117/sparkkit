import { Suspense } from 'react';
import type { Metadata } from 'next';

import { ShowcaseExplorerFallback } from '@/components/ShowcaseExplorer';
import { PAGE_SIZE } from '@/components/ShowcaseFilters';
import { ShowcasesPageShell } from '@/components/ShowcasesPageShell';
import { createSearchMetadata } from '@/lib/meta';
import { fetchDistinctFilters, fetchShowcases } from '@/lib/supabase';

export const revalidate = 900;

export const metadata: Metadata = createSearchMetadata();

export default async function SearchPage() {
  const [recordsRaw, filterOptions] = await Promise.all([
    fetchShowcases({ limit: PAGE_SIZE + 1, order: 'latest' }),
    fetchDistinctFilters(),
  ]);

  const records = recordsRaw.slice(0, PAGE_SIZE);
  const hasNext = recordsRaw.length > PAGE_SIZE;

  return (
    <Suspense
      fallback={
        <ShowcaseExplorerFallback
          filterOptions={{
            availableTags: filterOptions.tags,
            stacks: filterOptions.stacks,
            difficulties: filterOptions.difficulties,
          }}
        />
      }
    >
      <ShowcasesPageShell
        initialRecords={records}
        initialHasNext={hasNext}
        filterOptions={{
          availableTags: filterOptions.tags,
          stacks: filterOptions.stacks,
          difficulties: filterOptions.difficulties,
        }}
      />
    </Suspense>
  );
}
