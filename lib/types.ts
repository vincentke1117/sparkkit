export type ShowcaseRecord = {
  id: string;
  pen_user: string;
  pen_slug: string;
  author_name: string | null;
  author_url: string | null;
  thumbnail_url: string | null;
  oembed_html: string | null;
  stack: string | null;
  tags: string[] | null;
  difficulty: string | null;
  title_zh: string | null;
  title_en: string | null;
  summary_zh: string | null;
  summary_en: string | null;
  headline_zh: string | null;
  headline_en: string | null;
  key_points_zh: string[] | null;
  key_points_en: string[] | null;
  body_md_zh: string | null;
  body_md_en: string | null;
  reuse_steps_zh: string[] | null;
  reuse_steps_en: string[] | null;
  perf_notes_zh: string | null;
  perf_notes_en: string | null;
  created_at?: string | null;
  updated_at?: string | null;
};

export type ShowcaseFilters = {
  query?: string;
  tags?: string[];
  stack?: string;
  difficulty?: string;
<<<<<<< HEAD
  order?: 'latest' | 'oldest';
=======
>>>>>>> main
  limit?: number;
  offset?: number;
};

export type SyncStatus = {
  version: string;
  lastSyncedAt: string;
  totalIndexed: number;
  cacheHitRate?: number | null;
};
