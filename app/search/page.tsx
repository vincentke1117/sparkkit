import { Suspense } from 'react';
import type { Metadata } from 'next';

import { ShowcaseExplorer, ShowcaseExplorerFallback } from '@/components/ShowcaseExplorer';
import { PAGE_SIZE } from '@/components/ShowcaseFilters';
import { fetchDistinctFilters, fetchShowcases } from '@/lib/supabase';
import { getSiteUrl } from '@/lib/site';

export const revalidate = 900;

export const metadata: Metadata = {
  title: '搜索',
  description: '在 SparkKit 中搜索 CodePen 灵感，支持关键词、标签、Stack 与难度组合查询。',
  alternates: {
    canonical: getSiteUrl('/search'),
    languages: {
      'en-US': getSiteUrl('/search'),
      'zh-CN': getSiteUrl('/search?hl=zh-cn'),
      'x-default': getSiteUrl('/search'),
    },
  },
};

export default async function SearchPage() {
  const [showcasesRaw, filters] = await Promise.all([
    fetchShowcases({ limit: PAGE_SIZE + 1 }),
    fetchDistinctFilters(),
  ]);

  const showcases = showcasesRaw.slice(0, PAGE_SIZE);
  const hasNext = showcasesRaw.length > PAGE_SIZE;

  return (
    <div className="mx-auto flex w-full max-w-7xl flex-col gap-10 px-6 pb-24 pt-16 md:px-10 lg:px-16">
      <header className="flex flex-col gap-3">
        <p className="text-xs uppercase tracking-[0.3em] text-white/50">Search</p>
        <h1 className="text-3xl font-semibold text-white">搜索作品</h1>
        <p className="max-w-2xl text-sm leading-relaxed text-white/70">
          支持组合检索标题、摘要、解读正文，并按标签、Stack、难度进一步缩小范围。搜索结果以 15 分钟为周期自动刷新。
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
