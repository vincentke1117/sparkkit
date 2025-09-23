'use client';

import { useEffect, useRef, useState } from 'react';
import { clsx } from 'clsx';

type OEmbedFrameProps = {
  html: string;
  title?: string;
  className?: string;
  minHeightClass?: string;
  loadingText: string;
};

export function OEmbedFrame({
  html,
  title,
  className,
  minHeightClass = 'min-h-[28rem]',
  loadingText,
}: OEmbedFrameProps) {
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

  useEffect(() => {
    if (!shouldRender) {
      return;
    }

    const container = containerRef.current;
    if (!container) {
      return;
    }

    const embeds = container.querySelectorAll('iframe, embed, object');
    embeds.forEach((element) => {
      const target = element as HTMLElement;
      target.removeAttribute('width');
      target.removeAttribute('height');
      target.style.width = '100%';
      target.style.height = '100%';
      target.style.minHeight = 'inherit';
      target.style.display = 'block';
      target.style.border = '0';
      target.style.borderRadius = '24px';
    });
  }, [shouldRender]);

  return (
    <div
      ref={containerRef}
      className={clsx('oembed-frame rounded-3xl border border-white/10 bg-black/40 p-4', minHeightClass, className)}
      aria-label={title ? `${title} embed` : undefined}
    >
      {shouldRender ? (
        <div dangerouslySetInnerHTML={{ __html: html }} />
      ) : (
        <div className="flex h-full items-center justify-center text-sm text-white/60">
          <span>{loadingText}</span>
        </div>
      )}
    </div>
  );
}
