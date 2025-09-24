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
    difficultyFallback: string;
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
      difficultyFallback: 'Unspecified',
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
      strapline: 'SparkKit pulse',
      title: 'Showcase highlights',
      description:
        'A quick snapshot of the bilingual gallery — see when the library was last refreshed and how many CodePen showcases are ready for reuse.',
      metrics: {
        versionLabel: 'Curation batch',
        versionHint: 'Matches the latest editorial release.',
        syncLabel: 'Last refresh',
        syncHint: 'Supabase pull and page regeneration timestamp.',
        indexedLabel: 'Showcases live',
        indexedHint: 'Total pens currently featured across the site.',
      },
      cacheTitle: 'What we curate',
      cacheBody:
        'SparkKit spotlights inventive CSS, SVG, and WebGL experiments with Chinese and English commentary, plus actionable reuse notes for every pick.',
      cacheHitLabel: 'Bilingual coverage',
      cachePending: 'TBD',
      revalidateProtected: 'Themes: CSS · SVG · WebGL',
      cronCadence: 'Language toggle: 中文 / English',
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
      difficultyFallback: '未标注',
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
      strapline: 'SparkKit 速览',
      title: '策展速览',
      description:
        '快速了解 SparkKit 双语策展的最新进度：看看作品库何时刷新、当前上线了多少 CodePen 灵感。',
      metrics: {
        versionLabel: '策展批次',
        versionHint: '对应最新的发布标签。',
        syncLabel: '最近更新',
        syncHint: 'Supabase 拉取与页面再生成的时间。',
        indexedLabel: '已上线作品',
        indexedHint: '索引、站点地图与 RSS 正在展示的作品总数。',
      },
      cacheTitle: '我们在呈现什么',
      cacheBody:
        'SparkKit 专注 CSS、SVG、WebGL 等前端实验，提供中英文解读、亮点提炼与复用建议，助你快速借鉴。',
      cacheHitLabel: '双语覆盖率',
      cachePending: '统计中',
      revalidateProtected: '主题聚焦：CSS · SVG · WebGL',
      cronCadence: '语言切换：中文 / English',
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
