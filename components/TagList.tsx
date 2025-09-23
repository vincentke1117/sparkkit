'use client';

import { clsx } from 'clsx';

export function TagList({
  tags,
  className,
}: {
  tags?: string[] | null;
  className?: string;
}) {
  if (!tags || tags.length === 0) {
    return null;
  }

  return (
    <ul className={clsx('flex flex-wrap gap-2 text-xs text-white/80', className)}>
      {tags.map((tag) => (
        <li key={tag} className="tag-pill">
          {tag}
        </li>
      ))}
    </ul>
  );
}
