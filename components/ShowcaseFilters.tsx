'use client';

import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { useMemo, useState, FormEvent, useEffect } from 'react';

import { getUiCopy } from '@/lib/translations';

import { useLanguage } from './LanguageProvider';

const PAGE_SIZE = 12;

type Props = {
  availableTags: string[];
  stacks: string[];
  difficulties: string[];
};

export function ShowcaseFilters({ availableTags, stacks, difficulties }: Props) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const { locale } = useLanguage();
  const copy = getUiCopy(locale);

  const initialTags = useMemo(() => new Set(searchParams.getAll('tags')), [searchParams]);

  const [query, setQuery] = useState(searchParams.get('q') ?? '');
  const [stack, setStack] = useState(searchParams.get('stack') ?? '');
  const [difficulty, setDifficulty] = useState(searchParams.get('difficulty') ?? '');
  const [selectedTags, setSelectedTags] = useState<Set<string>>(initialTags);
  const [tagsOpen, setTagsOpen] = useState(initialTags.size > 0);

  useEffect(() => {
    setQuery(searchParams.get('q') ?? '');
    setStack(searchParams.get('stack') ?? '');
    setDifficulty(searchParams.get('difficulty') ?? '');
    const nextTags = new Set(searchParams.getAll('tags'));
    setSelectedTags(nextTags);
    setTagsOpen(nextTags.size > 0);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchParams.toString()]);

  function toggleTag(tag: string) {
    setSelectedTags((prev) => {
      const next = new Set(prev);
      if (next.has(tag)) {
        next.delete(tag);
      } else {
        next.add(tag);
      }
      return next;
    });
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const params = new URLSearchParams();
    if (query.trim()) {
      params.set('q', query.trim());
    }
    if (stack) {
      params.set('stack', stack);
    }
    if (difficulty) {
      params.set('difficulty', difficulty);
    }
    Array.from(selectedTags)
      .filter(Boolean)
      .forEach((tag) => params.append('tags', tag));

    const queryString = params.toString();
    router.push(queryString ? `${pathname}?${queryString}` : pathname ?? '/showcases');
  }

  function handleReset() {
    setQuery('');
    setStack('');
    setDifficulty('');
    setSelectedTags(new Set());
    router.push(pathname ?? '/showcases');
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="glass-panel flex flex-col gap-6 rounded-3xl p-6 text-sm text-white/80"
      aria-label={copy.filters.ariaLabel}
    >
      <div className="flex flex-col gap-2">
        <label htmlFor="query" className="text-xs font-semibold uppercase tracking-widest text-white/60">
          {copy.filters.keywordLabel}
        </label>
        <input
          id="query"
          name="q"
          type="search"
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          placeholder={copy.filters.keywordPlaceholder}
          className="focus-outline rounded-xl border border-white/10 bg-white/10 px-4 py-3 text-sm text-white placeholder:text-white/40"
        />
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <label className="flex flex-col gap-2 text-xs font-semibold uppercase tracking-widest text-white/60">
          {copy.filters.stackLabel}
          <select
            value={stack}
            onChange={(event) => setStack(event.target.value)}
            className="focus-outline rounded-xl border border-white/10 bg-white/10 px-4 py-3 text-sm text-white"
          >
            <option value="">{copy.filters.allOption}</option>
            {stacks.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
        </label>

        <label className="flex flex-col gap-2 text-xs font-semibold uppercase tracking-widest text-white/60">
          {copy.filters.difficultyLabel}
          <select
            value={difficulty}
            onChange={(event) => setDifficulty(event.target.value)}
            className="focus-outline rounded-xl border border-white/10 bg-white/10 px-4 py-3 text-sm text-white"
          >
            <option value="">{copy.filters.allOption}</option>
            {difficulties.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
        </label>
      </div>

      <fieldset className="flex flex-col gap-3">
        <div className="flex items-center justify-between gap-4">
          <legend className="text-xs font-semibold uppercase tracking-widest text-white/60">
            {copy.filters.tagsLabel}
          </legend>
          <button
            type="button"
            onClick={() => setTagsOpen((prev) => !prev)}
            className="focus-outline inline-flex items-center gap-2 rounded-full border border-white/15 px-3 py-1 text-[0.7rem] uppercase tracking-[0.2em] text-white/70 transition hover:border-accent/50 hover:text-white"
            aria-expanded={tagsOpen}
          >
            {tagsOpen ? copy.filters.hideTags : copy.filters.showTags}
          </button>
        </div>
        {tagsOpen ? (
          <div className="flex flex-wrap gap-2">
            {availableTags.map((tag) => {
              const checked = selectedTags.has(tag);
              return (
                <label
                  key={tag}
                  className={`focus-outline inline-flex cursor-pointer select-none items-center gap-2 rounded-full border px-3 py-2 text-xs transition ${
                    checked
                      ? 'border-accent/70 bg-accent/20 text-white'
                      : 'border-white/20 bg-white/5 text-white/70 hover:border-accent/50 hover:text-white'
                  }`}
                >
                  <input
                    type="checkbox"
                    className="sr-only"
                    checked={checked}
                    onChange={() => toggleTag(tag)}
                    name="tags"
                    value={tag}
                  />
                  #{tag}
                </label>
              );
            })}
            {availableTags.length === 0 ? <span className="text-white/40">{copy.filters.noTags}</span> : null}
          </div>
        ) : (
          <p className="rounded-2xl border border-dashed border-white/15 bg-white/5 px-4 py-3 text-xs text-white/60">
            {copy.filters.tagsHint}
          </p>
        )}
      </fieldset>

      <div className="mt-2 flex flex-wrap items-center gap-4">
        <button
          type="submit"
          className="neon-border focus-outline inline-flex items-center gap-2 rounded-full bg-white/10 px-6 py-3 text-sm font-medium text-white"
        >
          {copy.filters.apply}
        </button>
        <button
          type="button"
          onClick={handleReset}
          className="focus-outline inline-flex items-center gap-2 rounded-full border border-white/20 px-6 py-3 text-sm text-white/70 hover:border-accent/60 hover:text-white"
        >
          {copy.filters.reset}
        </button>
      </div>
    </form>
  );
}

export function usePagination() {
  const searchParams = useSearchParams();
  const page = Number.parseInt(searchParams.get('page') ?? '1', 10);
  return Number.isNaN(page) || page < 1 ? 1 : page;
}

export { PAGE_SIZE };
