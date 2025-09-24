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

const EMBED_HEIGHT_MULTIPLIER = 2;
const EMBED_FALLBACK_MIN_HEIGHT = 640;
function parsePixelValue(value: string | null | undefined): number | null {
  if (!value) {
    return null;
  }

  const trimmed = value.trim();
  if (!trimmed) {
    return null;
  }

  if (trimmed.endsWith('%') || trimmed.startsWith('calc(')) {
    return null;
  }

  const match = trimmed.match(/([0-9]+(?:\.[0-9]+)?)/);
  if (!match) {
    return null;
  }

  const numeric = Number.parseFloat(match[1]);
  if (!Number.isFinite(numeric) || numeric <= 0) {
    return null;
  }

  return numeric;
}

function readDimension(element: HTMLElement, dimension: 'width' | 'height'): number | null {
  const direct = parsePixelValue(element.getAttribute(dimension));
  if (direct) {
    return direct;
  }

  const dataAttr = parsePixelValue(element.getAttribute(`data-${dimension}`));
  if (dataAttr) {
    return dataAttr;
  }

  const datasetKey = dimension === 'width' ? 'width' : 'height';
  const datasetValue = parsePixelValue(element.dataset[datasetKey]);
  if (datasetValue) {
    return datasetValue;
  }

  const inlineStyleValue = element.style.getPropertyValue(dimension);
  const inline = parsePixelValue(inlineStyleValue);
  if (inline) {
    return inline;
  }

  const styleAttr = element.getAttribute('style');
  if (styleAttr) {
    const regex = new RegExp(`${dimension}\\s*:\\s*([^;]+)`, 'i');
    const styleMatch = styleAttr.match(regex);
    const styleValue = parsePixelValue(styleMatch?.[1]);
    if (styleValue) {
      return styleValue;
    }
  }

  return null;
}

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

    const embeds = Array.from(container.querySelectorAll<HTMLElement>('iframe, embed, object'));

    if (embeds.length === 0) {
      container.style.removeProperty('--oembed-min-height');
      container.style.removeProperty('min-height');
      container.style.removeProperty('--oembed-aspect-ratio');
      container.style.removeProperty('aspect-ratio');
      delete container.dataset.hasAspect;
      return;
    }

    let inferredHeight: number | null = null;
    let inferredWidth: number | null = null;

    embeds.forEach((element) => {
      if (inferredHeight === null) {
        inferredHeight = readDimension(element, 'height');
      }
      if (inferredWidth === null) {
        inferredWidth = readDimension(element, 'width');
      }
    });

    if (!inferredHeight) {
      const rect = embeds[0].getBoundingClientRect();
      if (Number.isFinite(rect.height) && rect.height > 0) {
        inferredHeight = rect.height;
      }
    }

    const baseHeight = inferredHeight && Number.isFinite(inferredHeight) ? inferredHeight : null;
    const targetHeight = baseHeight
      ? Math.max(Math.round(baseHeight * EMBED_HEIGHT_MULTIPLIER), Math.round(baseHeight), EMBED_FALLBACK_MIN_HEIGHT)
      : EMBED_FALLBACK_MIN_HEIGHT;

    const aspectRatio = inferredWidth ? inferredWidth / targetHeight : null;

    embeds.forEach((element) => {
      element.removeAttribute('width');
      element.removeAttribute('height');
      element.style.width = '100%';
      element.style.display = 'block';
      element.style.border = '0';
      element.style.borderRadius = '24px';

      if (aspectRatio && Number.isFinite(aspectRatio) && aspectRatio > 0) {
        element.style.height = '100%';
        element.style.minHeight = '100%';
      } else if (targetHeight) {
        const heightPx = `${Math.round(targetHeight)}px`;
        element.style.height = heightPx;
        element.style.minHeight = heightPx;
      } else {
        element.style.height = '100%';
        element.style.minHeight = 'inherit';
      }
    });

    if (aspectRatio && Number.isFinite(aspectRatio) && aspectRatio > 0 && inferredWidth) {
      const widthValue = Math.max(Math.round(inferredWidth), 1);
      const heightValue = Math.max(Math.round(targetHeight), 1);
      const ratioValue = `${widthValue} / ${heightValue}`;
      container.dataset.hasAspect = 'true';
      container.style.setProperty('--oembed-aspect-ratio', ratioValue);
      container.style.setProperty('aspect-ratio', ratioValue);
    } else {
      delete container.dataset.hasAspect;
      container.style.removeProperty('--oembed-aspect-ratio');
      container.style.removeProperty('aspect-ratio');
    }

    const heightPx = `${Math.round(targetHeight)}px`;
    container.style.setProperty('--oembed-min-height', heightPx);
    container.style.minHeight = heightPx;
  }, [shouldRender, html]);

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
