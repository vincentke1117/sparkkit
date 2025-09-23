import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="mx-auto flex min-h-[60vh] w-full max-w-3xl flex-col items-center justify-center gap-6 px-6 text-center text-white">
      <h1 className="text-4xl font-semibold text-gradient">未找到页面</h1>
      <p className="text-sm text-white/70">
        抱歉，我们没有找到对应的作品或页面。请返回列表或搜索其他灵感。
      </p>
      <div className="flex flex-wrap items-center justify-center gap-4 text-sm">
        <Link href="/showcases" className="neon-border focus-outline inline-flex items-center gap-2 rounded-full bg-white/10 px-6 py-3">
          返回作品列表
        </Link>
        <Link
          href="/"
          className="focus-outline inline-flex items-center gap-2 rounded-full border border-white/20 px-6 py-3 text-white/80 hover:border-accent/60 hover:text-white"
        >
          回到首页
        </Link>
      </div>
    </div>
  );
}
