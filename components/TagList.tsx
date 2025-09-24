'use client';

import { clsx } from 'clsx';

type TagListVariant = 'dark' | 'light';

export function TagList({
  tags,
  className,
  variant = 'dark',
}: {
  tags?: string[] | null;
  className?: string;
  variant?: TagListVariant;
}) {
  if (!tags || tags.length === 0) {
    return null;
  }

  return (
    <ul
      className={clsx(
        'flex flex-wrap gap-2 text-xs',
        variant === 'light' ? 'text-slate-600' : 'text-white/80',
        className,
      )}
    >
      {tags.map((tag) => (
        <li key={tag} className={clsx('tag-pill', variant === 'light' && 'tag-pill--light')}>
          {tag}
        </li>
      ))}
    </ul>
  );
}
