import { mockShowcases } from './mockData';
import { ShowcaseFilters, ShowcaseRecord } from './types';

export const SHOWCASE_TABLE_CANDIDATES = Array.from(
  new Set(
    [process.env.NEXT_PUBLIC_SUPABASE_TABLE, 'frontend_showcase', 'codepen_showcases'].filter(
      (value): value is string => Boolean(value && value.trim().length > 0),
    ),
  ),
);

function getRecencyTimestamp(record: ShowcaseRecord): number {
  const created = record.created_at ? Date.parse(record.created_at) : 0;
  const updated = record.updated_at ? Date.parse(record.updated_at) : 0;
  return Math.max(created, updated);
}

export function sortShowcasesByRecency(records: ShowcaseRecord[], order: 'latest' | 'oldest' = 'latest'): ShowcaseRecord[] {
  const factor = order === 'oldest' ? 1 : -1;
  return [...records].sort((a, b) => (getRecencyTimestamp(a) - getRecencyTimestamp(b)) * factor);
}

export function getSortedMockShowcases(order: 'latest' | 'oldest' = 'latest'): ShowcaseRecord[] {
  return sortShowcasesByRecency(mockShowcases, order);
}

export function applyFallbackFilters(data: ShowcaseRecord[], filters: ShowcaseFilters): ShowcaseRecord[] {
  const sorted = sortShowcasesByRecency(data, filters.order ?? 'latest');
  const query = filters.query?.trim().toLowerCase();
  const tags = filters.tags?.map((tag) => tag.toLowerCase());
  return sorted
    .filter((item) => {
      let matches = true;
      if (query) {
        const bucket = [
          item.title_en,
          item.title_zh,
          item.summary_en,
          item.summary_zh,
          item.body_md_en,
          item.body_md_zh,
        ]
          .filter(Boolean)
          .join(' ')
          .toLowerCase();
        matches = bucket.includes(query);
      }

      if (matches && tags && tags.length > 0) {
        const itemTags = (item.tags ?? []).map((tag) => tag.toLowerCase());
        matches = tags.some((tag) => itemTags.includes(tag));
      }

      if (matches && filters.stack) {
        matches = (item.stack ?? '').toLowerCase() === filters.stack.toLowerCase();
      }

      if (matches && filters.difficulty) {
        matches = (item.difficulty ?? '').toLowerCase() === filters.difficulty.toLowerCase();
      }

      return matches;
    })
    .slice(filters.offset ?? 0, (filters.offset ?? 0) + (filters.limit ?? data.length));
}
