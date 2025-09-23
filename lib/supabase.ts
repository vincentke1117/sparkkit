import 'server-only';

import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { cache } from 'react';

import { mockShowcases, mockStatus } from './mockData';
import { ShowcaseFilters, ShowcaseRecord, SyncStatus } from './types';

const SHOWCASES_TABLE = process.env.NEXT_PUBLIC_SUPABASE_TABLE ?? 'codepen_showcases';
const STATUS_VIEW = process.env.NEXT_PUBLIC_SUPABASE_STATUS_VIEW ?? 'showcase_sync_status';

let client: SupabaseClient | null = null;

function getSupabaseClient(): SupabaseClient | null {
  if (client) {
    return client;
  }

  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!url || !anonKey) {
    return null;
  }

  client = createClient(url, anonKey, {
    auth: {
      persistSession: false,
    },
  });

  return client;
}

function applyFallbackFilters(data: ShowcaseRecord[], filters: ShowcaseFilters): ShowcaseRecord[] {
  const query = filters.query?.trim().toLowerCase();
  const tags = filters.tags?.map((tag) => tag.toLowerCase());
  return data
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

export const fetchShowcases = cache(async (filters: ShowcaseFilters = {}): Promise<ShowcaseRecord[]> => {
  const supabase = getSupabaseClient();

  if (!supabase) {
    return applyFallbackFilters(
      [...mockShowcases].sort(
        (a, b) => (Date.parse(b.created_at ?? '') || 0) - (Date.parse(a.created_at ?? '') || 0),
      ),
      filters,
    );
  }

  let queryBuilder = supabase
    .from(SHOWCASES_TABLE)
    .select('*')
    .order('created_at', { ascending: false });

  if (filters.query) {
    const like = `%${filters.query}%`;
    queryBuilder = queryBuilder.or(
      `title_en.ilike.${like},summary_en.ilike.${like},body_md_en.ilike.${like},title_zh.ilike.${like},summary_zh.ilike.${like},body_md_zh.ilike.${like}`,
    );
  }

  if (filters.tags && filters.tags.length > 0) {
    queryBuilder = queryBuilder.overlaps('tags', filters.tags);
  }

  if (filters.stack) {
    queryBuilder = queryBuilder.eq('stack', filters.stack);
  }

  if (filters.difficulty) {
    queryBuilder = queryBuilder.eq('difficulty', filters.difficulty);
  }

  if (typeof filters.limit === 'number') {
    const from = filters.offset ?? 0;
    const to = from + filters.limit - 1;
    queryBuilder = queryBuilder.range(from, to);
  }

  const { data, error } = await queryBuilder.returns<ShowcaseRecord[]>();

  if (error) {
    console.error('[SparkKit] Failed to load showcases from Supabase:', error.message);
    return applyFallbackFilters(mockShowcases, filters);
  }

  return data ?? [];
});

export const fetchShowcaseByUserAndSlug = cache(
  async (penUser: string, penSlug: string): Promise<ShowcaseRecord | null> => {
    const supabase = getSupabaseClient();

    if (!supabase) {
      return mockShowcases.find((item) => item.pen_user === penUser && item.pen_slug === penSlug) ?? null;
    }

    const { data, error } = await supabase
      .from(SHOWCASES_TABLE)
      .select('*')
      .eq('pen_user', penUser)
      .eq('pen_slug', penSlug)
      .maybeSingle();

    if (error) {
      console.error('[SparkKit] Failed to load showcase detail:', error.message);
      return mockShowcases.find((item) => item.pen_user === penUser && item.pen_slug === penSlug) ?? null;
    }

    return (data as ShowcaseRecord | null) ?? null;
  },
);

export const fetchDistinctFilters = cache(async () => {
  const supabase = getSupabaseClient();

  if (!supabase) {
    const tags = Array.from(new Set(mockShowcases.flatMap((item) => item.tags ?? []))).sort();
    const stacks = Array.from(new Set(mockShowcases.map((item) => item.stack).filter(Boolean) as string[])).sort();
    const difficulties = Array.from(
      new Set(mockShowcases.map((item) => item.difficulty).filter(Boolean) as string[]),
    ).sort();
    return { tags, stacks, difficulties };
  }

  const [{ data: tagData }, { data: stackData }, { data: difficultyData }] = await Promise.all([
    supabase.from(SHOWCASES_TABLE).select('tags').not('tags', 'is', null),
    supabase.from(SHOWCASES_TABLE).select('stack').not('stack', 'is', null),
    supabase.from(SHOWCASES_TABLE).select('difficulty').not('difficulty', 'is', null),
  ]);

  const tags = Array.from(
    new Set(
      (tagData ?? [])
        .flatMap((row) => (Array.isArray(row.tags) ? row.tags : []))
        .filter((tag): tag is string => Boolean(tag)),
    ),
  ).sort();
  const stacks = Array.from(
    new Set((stackData ?? []).map((row) => row.stack).filter((value): value is string => Boolean(value))),
  ).sort();
  const difficulties = Array.from(
    new Set(
      (difficultyData ?? [])
        .map((row) => row.difficulty)
        .filter((value): value is string => Boolean(value)),
    ),
  ).sort();

  return { tags, stacks, difficulties };
});

export const fetchSyncStatus = cache(async (): Promise<SyncStatus> => {
  const supabase = getSupabaseClient();

  if (!supabase) {
    return mockStatus;
  }

  const { data, error } = await supabase.from(STATUS_VIEW).select('*').limit(1).maybeSingle();

  if (error) {
    console.error('[SparkKit] Failed to load sync status:', error.message);
    return mockStatus;
  }

  if (!data) {
    return mockStatus;
  }

  const status = data as {
    version?: string | null;
    last_synced_at?: string | null;
    total_indexed?: number | null;
    cache_hit_rate?: number | null;
  };

  return {
    version: status.version ?? '0.0.0',
    lastSyncedAt: status.last_synced_at ?? new Date().toISOString(),
    totalIndexed: status.total_indexed ?? 0,
    cacheHitRate: status.cache_hit_rate ?? null,
  };
});
