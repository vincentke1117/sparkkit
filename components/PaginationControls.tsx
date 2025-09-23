'use client';

import Link from 'next/link';
import { usePathname, useSearchParams } from 'next/navigation';

import { PAGE_SIZE } from './ShowcaseFilters';

export function PaginationControls({
  hasNext,
  currentPage,
  isLoading = false,
}: {
  hasNext: boolean;
  currentPage: number;
  isLoading?: boolean;
}) {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const prevParams = new URLSearchParams(searchParams.toString());
  prevParams.set('page', Math.max(1, currentPage - 1).toString());
  const nextParams = new URLSearchParams(searchParams.toString());
  nextParams.set('page', (currentPage + 1).toString());

  const disablePrev = currentPage <= 1 || isLoading;
  const disableNext = !hasNext || isLoading;

  return (
    <nav
      className="flex items-center justify-between rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-xs text-white/70"
      aria-label="Pagination"
    >
      <div>
        第 {currentPage} 页 · 每页 {PAGE_SIZE} 条
      </div>
      <div className="flex items-center gap-2">
        <Link
          aria-disabled={disablePrev}
          tabIndex={disablePrev ? -1 : undefined}
          href={disablePrev ? pathname ?? '/showcases' : `${pathname}?${prevParams.toString()}`}
          className={`focus-outline inline-flex items-center gap-2 rounded-full border px-4 py-2 transition ${
            disablePrev
              ? 'cursor-not-allowed border-white/10 text-white/30'
              : 'border-white/20 text-white/70 hover:border-accent/60 hover:text-white'
          }`}
        >
          上一页
        </Link>
        <Link
          aria-disabled={disableNext}
          tabIndex={disableNext ? -1 : undefined}
          href={disableNext ? pathname ?? '/showcases' : `${pathname}?${nextParams.toString()}`}
          className={`focus-outline inline-flex items-center gap-2 rounded-full border px-4 py-2 transition ${
            disableNext
              ? 'cursor-not-allowed border-white/10 text-white/30'
              : 'border-white/20 text-white/70 hover:border-accent/60 hover:text-white'
          }`}
        >
          下一页
        </Link>
      </div>
    </nav>
  );
}
