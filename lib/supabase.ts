import 'server-only';

import { setDefaultResultOrder } from 'node:dns';

import { createClient, SupabaseClient, PostgrestError } from '@supabase/supabase-js';
import { cache } from 'react';

import { mockShowcases, mockStatus } from './mockData';
import { applyFallbackFilters, getSortedMockShowcases, SHOWCASE_TABLE_CANDIDATES, sortShowcasesByRecency } from './showcase-data';
import { ShowcaseFilters, ShowcaseRecord, SyncStatus } from './types';

if (typeof setDefaultResultOrder === 'function') {
  try {
    setDefaultResultOrder('ipv4first');
  } catch (error) {
    console.warn('[SparkKit] Failed to enforce IPv4 DNS resolution order:', error);
  }
}

const proxyUrl =
  process.env.HTTPS_PROXY ??
  process.env.https_proxy ??
  process.env.HTTP_PROXY ??
  process.env.http_proxy ??
  null;

const UNDICI_SPECIFIER = 'undici';

type UndiciModule = {
  ProxyAgent: new (proxyUrl: string) => unknown;
  fetch: typeof fetch;
};

let undiciPromise: Promise<UndiciModule | null> | null = null;
let cachedDispatcher: unknown = null;

async function loadUndici(): Promise<UndiciModule | null> {
  if (typeof window !== 'undefined') {
    return null;
  }

  if (!undiciPromise) {
    undiciPromise = import(/* webpackIgnore: true */ UNDICI_SPECIFIER)
      .then((module) => module)
      .catch((error) => {
        console.warn('[SparkKit] Optional dependency "undici" is unavailable, falling back to global fetch.', error);
        return null;
      });
  }

  return undiciPromise;
}

const fetchWithProxy: typeof fetch = async (input, init) => {
  if (!proxyUrl) {
    return fetch(input as any, init as any);
  }

  const undiciModule = await loadUndici();

  if (!undiciModule) {
    return fetch(input as any, init as any);
  }

  const { ProxyAgent: UndiciProxyAgent, fetch: undiciFetch } = undiciModule;

  if (!cachedDispatcher) {
    cachedDispatcher = new UndiciProxyAgent(proxyUrl);
  }

  const finalInit = { ...(init ?? {}), dispatcher: cachedDispatcher } as RequestInit & {
    // Dispatcher typing is provided at runtime by undici; using unknown keeps the dependency optional.
    dispatcher: unknown;
  };

  return undiciFetch(input as any, finalInit as any) as unknown as Promise<Response>;
};

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
    global: {
      fetch: fetchWithProxy,
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

function formatBatchVersion(timestamp: number | null | undefined): string {
  if (typeof timestamp !== 'number' || Number.isNaN(timestamp) || timestamp <= 0) {
    return '0.0.0';
  }

  const date = new Date(timestamp);

  if (Number.isNaN(date.getTime())) {
    return '0.0.0';
  }

  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');

  return `${year}.${month}.${day}`;
}

export const fetchShowcases = cache(async (filters: ShowcaseFilters = {}): Promise<ShowcaseRecord[]> => {
  const supabase = getSupabaseClient();

  if (!supabase) {
    return applyFallbackFilters(getSortedMockShowcases(filters.order ?? 'latest'), filters);
  }

  for (const table of SHOWCASE_TABLE_CANDIDATES) {
    let queryBuilder = supabase
      .from(table)
      .select('*')
      .order('created_at', { ascending: filters.order === 'oldest' });

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
      return applyFallbackFilters(getSortedMockShowcases(filters.order ?? 'latest'), filters);
    }

    if (data) {
      return sortShowcasesByRecency(data, filters.order ?? 'latest');
    }
  }

  return applyFallbackFilters(getSortedMockShowcases(filters.order ?? 'latest'), filters);
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

  for (const table of SHOWCASE_TABLE_CANDIDATES) {
    const countResponse = await supabase.from(table).select('id', { count: 'exact' }).limit(1);

    if (isMissingRelationError(countResponse.error)) {
      continue;
    }

    if (countResponse.error) {
      console.error(`[SparkKit] Failed to count showcases from table "${table}":`, countResponse.error.message);
      break;
    }

    const latestResponse = await supabase
      .from(table)
      .select('created_at, updated_at')
      .order('updated_at', { ascending: false, nullsFirst: false })
      .order('created_at', { ascending: false, nullsFirst: false })
      .limit(1);

    if (isMissingRelationError(latestResponse.error)) {
      continue;
    }

    if (latestResponse.error) {
      console.error(`[SparkKit] Failed to read latest showcase timestamp from table "${table}":`, latestResponse.error.message);
      break;
    }

    const latestRecord = latestResponse.data?.[0] as { created_at?: string | null; updated_at?: string | null } | undefined;
    const timestamps = [latestRecord?.created_at, latestRecord?.updated_at]
      .map((value) => (value ? Date.parse(value) : Number.NaN))
      .filter((value): value is number => typeof value === 'number' && !Number.isNaN(value));
    const latestTimestamp = timestamps.length > 0 ? Math.max(...timestamps) : null;
    const effectiveTimestamp = typeof latestTimestamp === 'number' ? latestTimestamp : Date.now();

    return {
      version: formatBatchVersion(latestTimestamp ?? null),
      lastSyncedAt: new Date(effectiveTimestamp).toISOString(),
      totalIndexed: typeof countResponse.count === 'number' ? countResponse.count : 0,
      cacheHitRate: null,
    };
  }

  return mockStatus;
});
