import { SupportedLocale } from './i18n';

type FeatureCopy = {
  title: string;
  description: string;
};

type LandingCopy = {
  strapline: string;
  heroTitle: string;
  heroDescription: string;
  directoryCta: string;
  features: FeatureCopy[];
  featuredTitle: string;
  featuredDescription: string;
  viewAll: string;
  collapse: string;
  masonryHint: string;
  empty: string;
  devNote: string;
};

type FilterCopy = {
  ariaLabel: string;
  keywordLabel: string;
  keywordPlaceholder: string;
  stackLabel: string;
  difficultyLabel: string;
  tagsLabel: string;
  allOption: string;
  apply: string;
  reset: string;
  noTags: string;
};

type PaginationCopy = {
  pageStatus: (page: number, pageSize: number) => string;
  previous: string;
  next: string;
};

type DetailCopy = {
  back: string;
  backFallback: string;
  authorLabel: string;
  openOnCodepen: string;
  publishedLabel: string;
  stackLabel: string;
  previewTitle: string;
  previewUnavailable: string;
  highlightsTitle: string;
  analysisTitle: string;
  reuseTitle: string;
  perfTitle: string;
  fallbackAnalysisTitle: string;
  fallbackAnalysisBody: string;
  originalLinkLabel: string;
  canonicalLabel: string;
};

type StatusCopy = {
  strapline: string;
  title: string;
  description: string;
  metrics: {
    versionLabel: string;
    versionHint: string;
    syncLabel: string;
    syncHint: string;
    indexedLabel: string;
    indexedHint: string;
  };
  cacheTitle: string;
  cacheBody: string;
  cacheHitLabel: string;
  cachePending: string;
  revalidateProtected: string;
  cronCadence: string;
};

type UiCopy = {
  nav: {
    home: string;
    showcases: string;
    status: string;
  };
  landing: LandingCopy;
  cards: {
    previewPlaceholder: string;
    openCodePen: string;
    untitled: string;
    stackFallback: string;
  };
  filters: FilterCopy;
  explorer: {
    noResultsTitle: string;
    noResultsBody: string;
  };
  pagination: PaginationCopy;
  detail: DetailCopy;
  showcases: {
    strapline: string;
    title: string;
    description: string;
    returnHome: string;
  };
  status: StatusCopy;
  errors: {
    notFoundTitle: string;
    notFoundDescription: string;
    goToIndex: string;
    goHome: string;
  };
  common: {
    previewLoading: string;
  };
};

const UI_COPY: Record<SupportedLocale, UiCopy> = {
  en: {
    nav: {
      home: 'Home',
      showcases: 'Showcase Index',
      status: 'Status',
    },
    landing: {
      strapline: 'Inspire · Decode · Reuse',
      heroTitle: 'Curated CodePen inspiration with bilingual deep dives',
      heroDescription:
        'SparkKit streams fresh showcases from Supabase and turns them into structured, bilingual breakdowns. Mobile-first SSR and ISR keep every idea indexable and ready to reuse.',
      directoryCta: 'Open showcase index',
      features: [
        {
          title: 'Original insights',
          description: 'Bilingual breakdowns covering key ideas, reuse steps, and performance notes for rapid adoption.',
        },
        {
          title: 'Searchable tags',
          description: 'Filter by stack, tags, and difficulty combinations to surface the perfect reference.',
        },
        {
          title: 'Respectful embeds',
          description: 'Credit every creator with lazy-loaded embeds, alt text, and direct CodePen links.',
        },
      ],
      featuredTitle: "Today's Picks",
      featuredDescription: 'The freshest six showcases from Supabase. Auto-refreshes with each sync.',
      viewAll: 'View entire gallery',
      collapse: 'Collapse gallery',
      masonryHint: 'Scroll to explore the full waterfall layout.',
      empty: 'More showcases are on the way — check back after the next sync.',
      devNote:
        'SEO / GEO note: canonical, OpenGraph, JSON-LD, and hreflang are configured. GEO badge relies on client locale.',
    },
    cards: {
      previewPlaceholder: 'Preview coming soon',
      openCodePen: 'CodePen',
      untitled: 'Untitled pen',
      stackFallback: 'Web',
    },
    filters: {
      ariaLabel: 'Showcase filters',
      keywordLabel: 'Keyword',
      keywordPlaceholder: 'Search title, summary, or analysis…',
      stackLabel: 'Stack',
      difficultyLabel: 'Difficulty',
      tagsLabel: 'Tags',
      allOption: 'All',
      apply: 'Apply filters',
      reset: 'Reset',
      noTags: 'No tags yet',
    },
    explorer: {
      noResultsTitle: 'No results',
      noResultsBody: 'Adjust the filters or try another keyword.',
    },
    pagination: {
      pageStatus: (page, pageSize) => `Page ${page} · ${pageSize} per page`,
      previous: 'Previous',
      next: 'Next',
    },
    detail: {
      back: 'Back',
      backFallback: 'Back to index',
      authorLabel: 'Author',
      openOnCodepen: 'Open on CodePen',
      publishedLabel: 'Published',
      stackLabel: 'Stack',
      previewTitle: 'Live preview',
      previewUnavailable: 'Preview unavailable — open CodePen to experience the pen.',
      highlightsTitle: 'Highlights',
      analysisTitle: 'Deep dive',
      reuseTitle: 'Reuse steps',
      perfTitle: 'Performance notes',
      fallbackAnalysisTitle: 'Details',
      fallbackAnalysisBody: 'Detailed commentary is coming soon. Visit CodePen to experience the pen firsthand.',
      originalLinkLabel: 'Original link',
      canonicalLabel: 'Canonical',
    },
    showcases: {
      strapline: 'Showcases',
      title: 'Showcase Index',
      description:
        'Filter the Supabase-powered showcase library by keyword, tags, stack, and difficulty. Incremental regeneration keeps the list fresh every 15 minutes.',
      returnHome: '← Back home',
    },
    status: {
      strapline: 'Status',
      title: 'Status dashboard',
      description:
        'Track the latest Supabase sync timestamp, indexed entries, and cache behaviour that keep SparkKit healthy alongside GitHub Actions automations.',
      metrics: {
        versionLabel: 'Version',
        versionHint: 'Matches the GitHub Actions release batch.',
        syncLabel: 'Last sync',
        syncHint: 'Timestamp for Supabase fetch and regeneration.',
        indexedLabel: 'Indexed entries',
        indexedHint: 'Sitemap and RSS limit themselves to this total.',
      },
      cacheTitle: 'Cache performance',
      cacheBody:
        'Pages combine ISR and CDN caching — the landing page and index refresh every 15–60 minutes, while detail pages update every 5–15 minutes. RSS and sitemap regenerate in lockstep with new data.',
      cacheHitLabel: 'Cache hit rate',
      cachePending: 'Pending',
      revalidateProtected: 'Revalidation token: protected',
      cronCadence: 'GitHub Actions cadence: daily',
    },
    errors: {
      notFoundTitle: 'Page not found',
      notFoundDescription: 'We could not locate that showcase. Return to the gallery or head back to the home page.',
      goToIndex: 'Return to showcase index',
      goHome: 'Back to home',
    },
    common: {
      previewLoading: 'Preview loading…',
    },
  },
  zh: {
    nav: {
      home: '首页',
      showcases: '灵感索引',
      status: '运行状态',
    },
    landing: {
      strapline: 'Inspire · Decode · Reuse',
      heroTitle: '精选 CodePen 灵感，双语深度解析随时复用',
      heroDescription:
        'SparkKit 从 Supabase 实时拉取作品，转化为结构化的双语解读。移动优先的 SSR + ISR 让灵感随时可索引、可复用。',
      directoryCta: '打开灵感索引',
      features: [
        {
          title: '原创解读',
          description: '双语拆解亮点、复用步骤与性能观察，帮助快速落地。',
        },
        {
          title: '可检索标签',
          description: '按 stack、标签、难度组合筛选，秒速定位灵感来源。',
        },
        {
          title: '合规嵌入',
          description: '尊重作者版权，提供懒加载嵌入与直达 CodePen 链接。',
        },
      ],
      featuredTitle: '今日精选',
      featuredDescription: '来自 Supabase 的最新 6 条作品，随每次同步自动刷新。',
      viewAll: '展开全部',
      collapse: '收起',
      masonryHint: '滚动浏览艺术化的瀑布流展示。',
      empty: '更多作品即将上线，欢迎在下一次同步后再来探索。',
      devNote: 'SEO / GEO 说明：已配置 canonical、OpenGraph、JSON-LD 与 hreflang；GEO 徽章基于客户端 locale。',
    },
    cards: {
      previewPlaceholder: '预览即将上线',
      openCodePen: 'CodePen',
      untitled: '未命名作品',
      stackFallback: 'Web',
    },
    filters: {
      ariaLabel: '作品筛选器',
      keywordLabel: '关键词',
      keywordPlaceholder: '搜索标题、摘要或解读…',
      stackLabel: 'Stack',
      difficultyLabel: '难度',
      tagsLabel: '标签',
      allOption: '全部',
      apply: '应用筛选',
      reset: '重置',
      noTags: '暂无标签',
    },
    explorer: {
      noResultsTitle: '暂无结果',
      noResultsBody: '调整筛选条件或尝试不同关键词。',
    },
    pagination: {
      pageStatus: (page, pageSize) => `第 ${page} 页 · 每页 ${pageSize} 条`,
      previous: '上一页',
      next: '下一页',
    },
    detail: {
      back: '返回',
      backFallback: '返回索引',
      authorLabel: '作者',
      openOnCodepen: '在 CodePen 打开',
      publishedLabel: '发布',
      stackLabel: 'Stack',
      previewTitle: '作品预览',
      previewUnavailable: '暂无法内嵌预览，请前往 CodePen 体验原作品。',
      highlightsTitle: '亮点解读',
      analysisTitle: '深入分析',
      reuseTitle: '复用步骤',
      perfTitle: '性能观察',
      fallbackAnalysisTitle: '作品详情',
      fallbackAnalysisBody: '详细解读尚未提供，欢迎直接访问 CodePen 感受作品。',
      originalLinkLabel: '原始链接',
      canonicalLabel: 'Canonical',
    },
    showcases: {
      strapline: 'Showcases',
      title: '灵感索引',
      description:
        '基于 Supabase 的灵感库，支持按关键词、标签、Stack 与难度组合筛选。列表每 15 分钟增量再生成，保持内容新鲜。',
      returnHome: '← 返回首页',
    },
    status: {
      strapline: 'Status',
      title: '运行状态',
      description:
        '状态面板展示最新的 Supabase 同步时间、已索引条目与缓存表现，并配合 GitHub Actions 自动化确保站点健康。',
      metrics: {
        versionLabel: '版本号',
        versionHint: '与 GitHub Actions 发布批次保持一致。',
        syncLabel: '最近同步',
        syncHint: '完成 Supabase 拉取与页面再生成的时间戳。',
        indexedLabel: '已索引条目',
        indexedHint: '站点地图与 RSS 将基于该数值截取最新记录。',
      },
      cacheTitle: '缓存表现',
      cacheBody:
        '页面级 ISR 与 CDN 缓存组合使用：首页与索引 15–60 分钟刷新，详情页 5–15 分钟更新。RSS 与 Sitemap 会在新数据到来时同步再生成。',
      cacheHitLabel: '缓存命中率',
      cachePending: '待采集',
      revalidateProtected: '再生成令牌：已保护',
      cronCadence: 'GitHub Actions 频率：每日',
    },
    errors: {
      notFoundTitle: '未找到页面',
      notFoundDescription: '抱歉，没有找到对应的作品。请返回索引或回到首页继续探索。',
      goToIndex: '返回作品索引',
      goHome: '回到首页',
    },
    common: {
      previewLoading: '作品预览加载中…',
    },
  },
};

export function getUiCopy(locale: SupportedLocale): UiCopy {
  return UI_COPY[locale];
}

export type { UiCopy };
