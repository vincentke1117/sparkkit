import { Suspense } from 'react';
import type { Metadata } from 'next';
import { ShowcaseExplorer, ShowcaseExplorerFallback } from '@/components/ShowcaseExplorer';
import { PAGE_SIZE } from '@/components/ShowcaseFilters';
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
    <div className="mx-auto flex w-full max-w-7xl flex-col gap-10 px-6 pb-24 pt-16 md:px-10 lg:px-16">
      <header className="flex flex-col gap-4">
        <div className="flex flex-col gap-2">
          <p className="text-xs uppercase tracking-[0.3em] text-white/50">Showcases</p>
          <h1 className="text-3xl font-semibold text-white">灵感索引</h1>
        </div>
        <p className="max-w-2xl text-sm leading-relaxed text-white/70">
          支持按关键词、标签、Stack 与难度筛选。内容自 Supabase 只读同步，并以 15 分钟节奏增量再生成，确保列表持续新鲜。
        </p>
      </header>

      <Suspense
        fallback={
          <ShowcaseExplorerFallback filterOptions={{ availableTags: filters.tags, stacks: filters.stacks, difficulties: filters.difficulties }} />
        }
      >
        <ShowcaseExplorer
          initialRecords={showcases}
          initialHasNext={hasNext}
          filterOptions={{ availableTags: filters.tags, stacks: filters.stacks, difficulties: filters.difficulties }}
        />
      </Suspense>
    </div>
  );
}
