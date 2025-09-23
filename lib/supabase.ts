import 'server-only';

import { createClient, SupabaseClient, PostgrestError } from '@supabase/supabase-js';
import { cache } from 'react';

import { mockShowcases, mockStatus } from './mockData';
import { applyFallbackFilters, getSortedMockShowcases, SHOWCASE_TABLE_CANDIDATES } from './showcase-data';
import { ShowcaseFilters, ShowcaseRecord, SyncStatus } from './types';

const STATUS_VIEW_CANDIDATES = Array.from(
  new Set(
    [process.env.NEXT_PUBLIC_SUPABASE_STATUS_VIEW, 'frontend_showcase_status', 'showcase_sync_status'].filter(
      (value): value is string => Boolean(value && value.trim().length > 0),
    ),
  ),
);

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

function isMissingRelationError(error: PostgrestError | null | undefined): boolean {
  if (!error) {
    return false;
  }

  if (error.code === '42P01' || error.code === 'PGRST205' || error.code === 'PGRST301') {
    return true;
  }

  const text = `${error.message ?? ''} ${error.details ?? ''}`.toLowerCase();
  return text.includes('does not exist') || text.includes('could not find the table');
}

export const fetchShowcases = cache(async (filters: ShowcaseFilters = {}): Promise<ShowcaseRecord[]> => {
  const supabase = getSupabaseClient();

  if (!supabase) {
    return applyFallbackFilters(getSortedMockShowcases(), filters);
  }

  for (const table of SHOWCASE_TABLE_CANDIDATES) {
    let queryBuilder = supabase
      .from(table)
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
      if (isMissingRelationError(error)) {
        continue;
      }
      console.error(`[SparkKit] Failed to load showcases from Supabase table "${table}":`, error.message);
      return applyFallbackFilters(getSortedMockShowcases(), filters);
    }

    if (data) {
      return data;
    }
  }

  return applyFallbackFilters(getSortedMockShowcases(), filters);
});

export const fetchShowcaseByUserAndSlug = cache(
  async (penUser: string, penSlug: string): Promise<ShowcaseRecord | null> => {
    const supabase = getSupabaseClient();

    if (!supabase) {
      return mockShowcases.find((item) => item.pen_user === penUser && item.pen_slug === penSlug) ?? null;
    }

    for (const table of SHOWCASE_TABLE_CANDIDATES) {
      const { data, error } = await supabase
        .from(table)
        .select('*')
        .eq('pen_user', penUser)
        .eq('pen_slug', penSlug)
        .maybeSingle();

      if (error) {
        if (isMissingRelationError(error)) {
          continue;
        }
        console.error(`[SparkKit] Failed to load showcase detail from table "${table}":`, error.message);
        break;
      }

      if (data) {
        return data as ShowcaseRecord;
      }
    }

    return mockShowcases.find((item) => item.pen_user === penUser && item.pen_slug === penSlug) ?? null;
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

  for (const table of SHOWCASE_TABLE_CANDIDATES) {
    const [tagResponse, stackResponse, difficultyResponse] = await Promise.all([
      supabase.from(table).select('tags').not('tags', 'is', null),
      supabase.from(table).select('stack').not('stack', 'is', null),
      supabase.from(table).select('difficulty').not('difficulty', 'is', null),
    ]);

    const responses = [tagResponse, stackResponse, difficultyResponse];

    if (responses.some(({ error }) => isMissingRelationError(error))) {
      continue;
    }

    const failed = responses.find(({ error }) => error);
    if (failed?.error) {
      console.error(`[SparkKit] Failed to load filters from Supabase table "${table}":`, failed.error.message);
      break;
    }

    const tagData = (tagResponse.data as { tags: string[] | null }[] | null) ?? [];
    const stackData = (stackResponse.data as { stack: string | null }[] | null) ?? [];
    const difficultyData = (difficultyResponse.data as { difficulty: string | null }[] | null) ?? [];

    const tags = Array.from(
      new Set(
        tagData
          .flatMap((row) => (Array.isArray(row.tags) ? row.tags : []))
          .filter((tag): tag is string => Boolean(tag)),
      ),
    ).sort();

    const stacks = Array.from(
      new Set(
        stackData.map((row) => row.stack).filter((value): value is string => Boolean(value)),
      ),
    ).sort();

    const difficulties = Array.from(
      new Set(
        difficultyData
          .map((row) => row.difficulty)
          .filter((value): value is string => Boolean(value)),
      ),
    ).sort();

    return { tags, stacks, difficulties };
  }

  const tagsFallback = Array.from(new Set(mockShowcases.flatMap((item) => item.tags ?? []))).sort();
  const stacksFallback = Array.from(new Set(mockShowcases.map((item) => item.stack).filter(Boolean) as string[])).sort();
  const difficultiesFallback = Array.from(
    new Set(mockShowcases.map((item) => item.difficulty).filter(Boolean) as string[]),
  ).sort();

  return { tags: tagsFallback, stacks: stacksFallback, difficulties: difficultiesFallback };
});

export const fetchSyncStatus = cache(async (): Promise<SyncStatus> => {
  const supabase = getSupabaseClient();

  if (!supabase) {
    return mockStatus;
  }

  for (const view of STATUS_VIEW_CANDIDATES) {
    const { data, error } = await supabase.from(view).select('*').limit(1).maybeSingle();

    if (error) {
      if (isMissingRelationError(error)) {
        continue;
      }
      console.error(`[SparkKit] Failed to load sync status from view "${view}":`, error.message);
      break;
    }

    if (!data) {
      continue;
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
  }

  return mockStatus;
});
