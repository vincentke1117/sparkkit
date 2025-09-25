import { Suspense } from 'react';
import type { Metadata } from 'next';

import { ShowcaseExplorerFallback } from '@/components/ShowcaseExplorer';
import { PAGE_SIZE } from '@/components/ShowcaseFilters';
import { ShowcasesPageShell } from '@/components/ShowcasesPageShell';
import { fetchDistinctFilters, fetchShowcases } from '@/lib/supabase';
import { getSiteUrl } from '@/lib/site';

export const revalidate = 900; // 15 minutes

export const metadata: Metadata = {
  title: '作品列表',
  description: '浏览 SparkKit 精选的 CodePen 作品，按关键词、标签、Stack 与难度筛选。',
  alternates: {
    canonical: getSiteUrl('/showcases'),
    languages: {
      'en-US': getSiteUrl('/showcases'),
      'zh-CN': getSiteUrl('/showcases?hl=zh-cn'),
      'x-default': getSiteUrl('/showcases'),
    },
  },
};

export default async function ShowcasesPage() {
  const [showcasesRaw, filters] = await Promise.all([
    fetchShowcases({ limit: PAGE_SIZE + 1 }),
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
