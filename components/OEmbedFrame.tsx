'use client';

import { useEffect, useRef, useState } from 'react';

export function OEmbedFrame({ html, title }: { html: string; title?: string }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [shouldRender, setShouldRender] = useState(false);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) {
      return;
    }

    if (typeof IntersectionObserver === 'undefined') {
      setShouldRender(true);
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setShouldRender(true);
            observer.disconnect();
          }
        });
      },
      { rootMargin: '200px 0px' },
    );

    observer.observe(container);

    return () => observer.disconnect();
  }, []);

  return (
    <div
      ref={containerRef}
      className="rounded-3xl border border-white/10 bg-black/40 p-4"
      aria-label={title ? `${title} embed` : undefined}
    >
      {shouldRender ? (
        <div dangerouslySetInnerHTML={{ __html: html }} />
      ) : (
        <div className="flex h-48 items-center justify-center text-sm text-white/60">
          <span>作品预览加载中…</span>
        </div>
      )}
    </div>
  );
}
