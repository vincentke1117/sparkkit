import { createClient, SupabaseClient, PostgrestError } from '@supabase/supabase-js';

import { applyFallbackFilters, getSortedMockShowcases, SHOWCASE_TABLE_CANDIDATES, sortShowcasesByRecency } from './showcase-data';
import { ShowcaseFilters, ShowcaseRecord } from './types';

let client: SupabaseClient | null = null;

function getClient(): SupabaseClient | null {
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
      autoRefreshToken: false,
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

export async function fetchShowcasesClient(filters: ShowcaseFilters = {}): Promise<ShowcaseRecord[]> {
  const supabase = getClient();

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
      console.warn(`[SparkKit] Failed to load showcases in browser from table "${table}":`, error.message);
      return applyFallbackFilters(getSortedMockShowcases(), filters);
    }

    if (data) {
      return sortShowcasesByRecency(data);
    }
  }

  return applyFallbackFilters(getSortedMockShowcases(), filters);
}
