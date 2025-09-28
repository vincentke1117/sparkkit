import { mockShowcases } from './mockData';
import { ShowcaseFilters, ShowcaseRecord } from './types';

const FEATURED_COUNT_PER_TIER = 3;
const DAILY_REFRESH_HOUR = 8; // 08:00 Beijing time
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

function normalizeDifficulty(value: string | null | undefined) {
  return value?.trim().toLowerCase() ?? '';
}

function hashString(input: string): number {
  let hash = 0;
  for (let index = 0; index < input.length; index += 1) {
    hash = (hash << 5) - hash + input.charCodeAt(index);
    hash |= 0; // Convert to 32-bit integer
  }
  return Math.abs(hash) + 1;
}

function createSeededRandom(seed: number) {
  let value = seed % 2147483647;
  if (value <= 0) {
    value += 2147483646;
  }
  return () => {
    value = (value * 16807) % 2147483647;
    return (value - 1) / 2147483646;
  };
}

function getBeijingCycleKey(reference: Date): string {
  const formatter = new Intl.DateTimeFormat('en-CA', {
    timeZone: 'Asia/Shanghai',
    hour12: false,
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
  });
  const parts = formatter.formatToParts(reference);
  const get = (type: Intl.DateTimeFormatPartTypes) => parts.find((part) => part.type === type)?.value ?? '0';

  let year = Number.parseInt(get('year'), 10);
  let month = Number.parseInt(get('month'), 10);
  let day = Number.parseInt(get('day'), 10);
  const hour = Number.parseInt(get('hour'), 10);

  if (Number.isNaN(year) || Number.isNaN(month) || Number.isNaN(day)) {
    return reference.toISOString().slice(0, 10);
  }

  if (!Number.isNaN(hour) && hour < DAILY_REFRESH_HOUR) {
    const previous = new Date(Date.UTC(year, month - 1, day));
    previous.setUTCDate(previous.getUTCDate() - 1);
    year = previous.getUTCFullYear();
    month = previous.getUTCMonth() + 1;
    day = previous.getUTCDate();
  }

  return `${year.toString().padStart(4, '0')}-${month.toString().padStart(2, '0')}-${day
    .toString()
    .padStart(2, '0')}`;
}

export function selectDailyFeatured(records: ShowcaseRecord[], referenceDate: Date = new Date()): ShowcaseRecord[] {
  if (records.length <= FEATURED_COUNT_PER_TIER * 2) {
    return records.slice(0, FEATURED_COUNT_PER_TIER * 2);
  }

  const cycleKey = getBeijingCycleKey(referenceDate);
  const random = createSeededRandom(hashString(cycleKey));
  const used = new Set<string>();

  const advancedPool = records.filter((record) => normalizeDifficulty(record.difficulty) === 'advanced');
  const intermediatePool = records.filter((record) => normalizeDifficulty(record.difficulty) === 'intermediate');

  const selections: ShowcaseRecord[] = [];

  function pickFromPool(pool: ShowcaseRecord[], count: number) {
    const candidates = pool.filter((item) => !used.has(item.id));
    while (candidates.length > 0 && selections.length < FEATURED_COUNT_PER_TIER * 2 && count > 0) {
      const index = Math.floor(random() * candidates.length);
      const [chosen] = candidates.splice(index, 1);
      if (!chosen) {
        break;
      }
      used.add(chosen.id);
      selections.push(chosen);
      count -= 1;
    }
  }

  pickFromPool(advancedPool, FEATURED_COUNT_PER_TIER);
  pickFromPool(intermediatePool, FEATURED_COUNT_PER_TIER);

  if (selections.length < FEATURED_COUNT_PER_TIER * 2) {
    const fallbackPool = records.filter((record) => !used.has(record.id));
    while (fallbackPool.length > 0 && selections.length < FEATURED_COUNT_PER_TIER * 2) {
      const index = Math.floor(random() * fallbackPool.length);
      const [chosen] = fallbackPool.splice(index, 1);
      if (!chosen) {
        break;
      }
      used.add(chosen.id);
      selections.push(chosen);
    }
  }

  const shuffled = [...selections];
  for (let i = shuffled.length - 1; i > 0; i -= 1) {
    const j = Math.floor(random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }

  return shuffled.slice(0, FEATURED_COUNT_PER_TIER * 2);
}
