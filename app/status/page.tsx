import type { Metadata } from 'next';

import { fetchSyncStatus } from '@/lib/supabase';
import { formatDateReadable } from '@/lib/i18n';
import { getDefaultLocale, getSiteUrl } from '@/lib/site';

export const revalidate = 300; // 5 minutes

export const metadata: Metadata = {
  title: '运行状态',
  description: '查看 SparkKit 的版本、最近同步时间、已索引条目与缓存表现。',
  alternates: {
    canonical: getSiteUrl('/status'),
    languages: {
      'en-US': getSiteUrl('/status'),
      'zh-CN': getSiteUrl('/status?hl=zh-cn'),
      'x-default': getSiteUrl('/status'),
    },
  },
};

export default async function StatusPage() {
  const status = await fetchSyncStatus();
  const locale = getDefaultLocale();
  const syncedAt = formatDateReadable(status.lastSyncedAt, locale);

  return (
    <div className="mx-auto flex w-full max-w-4xl flex-col gap-12 px-6 pb-24 pt-16 md:px-10">
      <header className="flex flex-col gap-3">
        <p className="text-xs uppercase tracking-[0.3em] text-white/50">Status</p>
        <h1 className="text-3xl font-semibold text-white">运行状态</h1>
        <p className="max-w-2xl text-sm text-white/70">
          状态页展示最近的 Supabase 同步时间、已索引条目数与缓存命中率，配合 GitHub Actions 定时任务监控站点健康。
        </p>
      </header>

      <section className="grid gap-6 md:grid-cols-3">
        <div className="glass-panel flex flex-col gap-2 rounded-3xl p-6 text-white/80">
          <span className="text-xs uppercase tracking-widest text-white/50">版本号</span>
          <span className="text-2xl font-semibold text-white">{status.version}</span>
          <p className="text-xs text-white/60">与 GitHub Actions 发布批次保持一致。</p>
        </div>
        <div className="glass-panel flex flex-col gap-2 rounded-3xl p-6 text-white/80">
          <span className="text-xs uppercase tracking-widest text-white/50">最近同步</span>
          <span className="text-2xl font-semibold text-white">{syncedAt ?? '—'}</span>
          <p className="text-xs text-white/60">完成 Supabase 拉取与页面再生成的时间戳。</p>
        </div>
        <div className="glass-panel flex flex-col gap-2 rounded-3xl p-6 text-white/80">
          <span className="text-xs uppercase tracking-widest text-white/50">已索引条目</span>
          <span className="text-2xl font-semibold text-white">{status.totalIndexed.toLocaleString()}</span>
          <p className="text-xs text-white/60">站点地图与 RSS 将基于该数值截取最新记录。</p>
        </div>
      </section>

      <section className="glass-panel flex flex-col gap-4 rounded-3xl p-8 text-sm text-white/80">
        <h2 className="text-xl font-semibold text-white">缓存表现</h2>
        <p>
          页面级 ISR 与 CDN 缓存组合使用，首页 /showcases 每 15–60 分钟自动再生成，详情页 5–15 分钟刷新。RSS 与 Sitemap 同步更新
          并带有最新的 lastmod。
        </p>
        <div className="flex flex-wrap gap-3 text-xs text-white/60">
          <span className="rounded-full border border-white/20 px-3 py-1">
            缓存命中率：{status.cacheHitRate !== undefined && status.cacheHitRate !== null
              ? `${Math.round(status.cacheHitRate * 100)}%`
              : '待采集'}
          </span>
          <span className="rounded-full border border-white/20 px-3 py-1">再生成令牌：受保护</span>
          <span className="rounded-full border border-white/20 px-3 py-1">GitHub Actions 定时任务：每日</span>
        </div>
      </section>
    </div>
  );
}
