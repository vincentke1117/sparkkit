import type { Metadata } from 'next';

import { PaginationControls } from '@/components/PaginationControls';
import { ShowcaseCard } from '@/components/ShowcaseCard';
import { ShowcaseFilters, PAGE_SIZE } from '@/components/ShowcaseFilters';
import { fetchDistinctFilters, fetchShowcases } from '@/lib/supabase';

export const revalidate = 900;

export const metadata: Metadata = {
  title: '搜索',
  description: '在 SparkKit 中搜索 CodePen 灵感，支持关键词、标签、Stack 与难度组合查询。',
  alternates: {
    canonical: 'https://sparkkit.dev/search',
    languages: {
      'en-US': 'https://sparkkit.dev/search',
      'zh-CN': 'https://sparkkit.dev/search?hl=zh-cn',
      'x-default': 'https://sparkkit.dev/search',
    },
  },
};

type SearchParams = {
  q?: string;
  tags?: string | string[];
  stack?: string;
  difficulty?: string;
  page?: string;
};

function normalizeTags(tags: SearchParams['tags']): string[] {
  if (!tags) {
    return [];
  }
  return Array.isArray(tags) ? tags : [tags];
}

export default async function SearchPage({ searchParams }: { searchParams: SearchParams }) {
  const page = Number.parseInt(searchParams.page ?? '1', 10) || 1;
  const offset = (page - 1) * PAGE_SIZE;
  const tags = normalizeTags(searchParams.tags);

  const [showcasesRaw, filters] = await Promise.all([
    fetchShowcases({
      query: searchParams.q,
      tags,
      stack: searchParams.stack,
      difficulty: searchParams.difficulty,
      limit: PAGE_SIZE + 1,
      offset,
    }),
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

      <div className="grid gap-8 lg:grid-cols-[320px,1fr] lg:items-start">
        <ShowcaseFilters
          availableTags={filters.tags}
          stacks={filters.stacks}
          difficulties={filters.difficulties}
        />

        <section className="flex flex-col gap-6">
          {showcases.length === 0 ? (
            <div className="glass-panel flex flex-col items-center gap-3 rounded-3xl p-12 text-center text-white/70">
              <h2 className="text-lg font-semibold text-white">未找到匹配结果</h2>
              <p>换个关键词或减少筛选条件再试试。</p>
            </div>
          ) : (
            <>
              <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
                {showcases.map((showcase) => (
                  <ShowcaseCard key={showcase.id} record={showcase} />
                ))}
              </div>
              <PaginationControls hasNext={hasNext} currentPage={page} />
            </>
          )}
        </section>
      </div>
    </div>
  );
}
