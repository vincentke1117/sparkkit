import Link from 'next/link';

import { GeoClock } from '@/components/GeoClock';
import { ShowcaseCard } from '@/components/ShowcaseCard';
import { fetchShowcases } from '@/lib/supabase';

export const revalidate = 1800; // 30 minutes cache for landing page

const FEATURE_CARDS = [
  {
    title: '原创解读',
    description: '双语解析核心创意、复用步骤与性能观察，帮助快速落地。',
  },
  {
    title: '可检索标签',
    description: '按 stack、标签、难度组合筛选，快速定位灵感来源。',
  },
  {
    title: '合规嵌入',
    description: '尊重作者版权，提供原笔链接与懒加载嵌入示例。',
  },
];

export default async function HomePage() {
  const showcases = await fetchShowcases({ limit: 6 });
  const isProduction = process.env.NODE_ENV === 'production';

  return (
    <div className="relative mx-auto flex w-full max-w-7xl flex-col gap-16 px-6 pb-24 pt-20 md:px-10 lg:px-16">
      <section className="relative overflow-hidden rounded-[32px] border border-white/15 bg-white/5 px-8 py-16 shadow-[0_20px_60px_rgba(0,0,0,0.45)]">
        <div className="absolute -top-28 right-10 h-48 w-48 rounded-full bg-accent/40 blur-3xl" aria-hidden />
        <div className="absolute -bottom-20 left-10 h-60 w-60 rounded-full bg-accentSecondary/30 blur-[160px]" aria-hidden />
        <div className="relative z-10 flex flex-col gap-10 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex max-w-2xl flex-col gap-6">
            <span className="inline-flex items-center gap-3 text-xs uppercase tracking-[0.3em] text-white/60">
              sparkkit
              <span className="h-1 w-8 rounded-full bg-gradient-to-r from-accent to-accentSecondary" aria-hidden />
              Inspire · Decode · Reuse
            </span>
            <h1 className="text-4xl font-semibold leading-tight text-gradient sm:text-5xl">
              精选 CodePen 灵感，深度解析、随时复用
            </h1>
            <p className="max-w-xl text-base leading-relaxed text-white/80">
              SparkKit 从 Supabase 只读抓取最新作品，将其转化为结构化多语言解读。以移动优先的 SSR + ISR 交付，让灵感随时可索引、可复用。
            </p>
            <div className="flex flex-wrap items-center gap-4">
              <Link
                href="/showcases"
                className="neon-border focus-outline inline-flex items-center gap-2 rounded-full bg-white/10 px-6 py-3 text-sm font-medium text-white transition"
              >
                浏览全部作品
                <span aria-hidden>↗</span>
              </Link>
              <Link
                href="/search"
                className="focus-outline inline-flex items-center gap-2 rounded-full border border-white/20 px-6 py-3 text-sm text-white/80 transition hover:border-accent/60 hover:text-white"
              >
                按标签筛选
              </Link>
              <GeoClock />
            </div>
          </div>
          <div className="grid w-full max-w-md grid-cols-1 gap-4">
            {FEATURE_CARDS.map((card) => (
              <div
                key={card.title}
                className="glass-panel focus-outline flex flex-col gap-3 rounded-3xl p-6 text-sm text-white/80 shadow-glow"
                tabIndex={0}
              >
                <h3 className="text-lg font-semibold text-white">{card.title}</h3>
                <p>{card.description}</p>
              </div>
            ))}
          </div>
        </div>
        {!isProduction ? (
          <aside className="mt-10 rounded-2xl border border-dashed border-white/20 bg-white/5 p-4 text-xs text-white/60" data-dev-note>
            <p>SEO / GEO 说明：页面含 canonical、OpenGraph、JSON-LD、hreflang；GEO 徽章基于客户端 locale。</p>
          </aside>
        ) : null}
      </section>

      <section className="flex flex-col gap-6">
        <div className="flex items-center justify-between gap-4">
          <div>
            <h2 className="text-2xl font-semibold text-white">今日精选</h2>
            <p className="text-sm text-white/70">最近发布的 6 条作品，自动随 Supabase 数据刷新。</p>
          </div>
          <Link
            href="/showcases"
            className="focus-outline inline-flex items-center gap-2 rounded-full border border-white/20 px-4 py-2 text-xs uppercase tracking-wide text-white/70 hover:border-accent/70 hover:text-white"
          >
            查看全部
          </Link>
        </div>
        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
          {showcases.map((showcase) => (
            <ShowcaseCard key={showcase.id} record={showcase} />
          ))}
        </div>
      </section>
    </div>
  );
}
