import type { Metadata } from 'next';
import Link from 'next/link';

import { PaginationControls } from '@/components/PaginationControls';
import { ShowcaseCard } from '@/components/ShowcaseCard';
import { ShowcaseFilters, PAGE_SIZE } from '@/components/ShowcaseFilters';
import { fetchDistinctFilters, fetchShowcases } from '@/lib/supabase';

export const revalidate = 900; // 15 minutes

export const metadata: Metadata = {
  title: '作品列表',
  description: '浏览 SparkKit 精选的 CodePen 作品，按关键词、标签、Stack 与难度筛选。',
  alternates: {
    canonical: 'https://sparkkit.dev/showcases',
    languages: {
      'en-US': 'https://sparkkit.dev/showcases',
      'zh-CN': 'https://sparkkit.dev/showcases?hl=zh-cn',
      'x-default': 'https://sparkkit.dev/showcases',
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

function parseTags(tags: SearchParams['tags']): string[] {
  if (!tags) {
    return [];
  }

  if (Array.isArray(tags)) {
    return tags;
  }

  return [tags];
}

export default async function ShowcasesPage({ searchParams }: { searchParams: SearchParams }) {
  const page = Number.parseInt(searchParams.page ?? '1', 10) || 1;
  const offset = (page - 1) * PAGE_SIZE;
  const tags = parseTags(searchParams.tags);

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
      <header className="flex flex-col gap-4">
        <div className="flex flex-col gap-2">
          <p className="text-xs uppercase tracking-[0.3em] text-white/50">Showcases</p>
          <h1 className="text-3xl font-semibold text-white">灵感索引</h1>
        </div>
        <p className="max-w-2xl text-sm leading-relaxed text-white/70">
          支持按关键词、标签、Stack 与难度筛选。内容自 Supabase 只读同步，并以 15 分钟节奏增量再生成，确保列表持续新鲜。
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
              <h2 className="text-lg font-semibold text-white">暂无结果</h2>
              <p>调整筛选条件或尝试不同关键词。</p>
              <Link
                href="/showcases"
                className="focus-outline inline-flex items-center gap-2 rounded-full border border-white/20 px-5 py-2 text-xs uppercase tracking-wide text-white/70 hover:border-accent/60 hover:text-white"
              >
                重置筛选
              </Link>
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
