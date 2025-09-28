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
  rssCta: string;
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
  dateLabel: string;
  tagsLabel: string;
  allOption: string;
  apply: string;
  reset: string;
  noTags: string;
  showTags: string;
  hideTags: string;
  tagsHint: string;
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
  difficultyLabel: string;
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

type FooterCopy = {
  copyright: string;
  privacy: string;
  terms: string;
  support: string;
  compliance: string;
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
    copyLink: string;
    copySuccess: string;
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
  footer: FooterCopy;
};

const UI_COPY: Record<SupportedLocale, UiCopy> = {
  en: {
    nav: {
      home: 'Home',
      showcases: 'Showcases',
      status: 'Status',
    },
    landing: {
      strapline: 'Inspire · Decode · Reuse',
      heroTitle: '6 fresh showcases daily — ready to reuse',
      heroDescription:
        'From wow to how: SparkKit distills the key ideas, reuse steps, and performance notes so you ship faster.',
      directoryCta: 'Browse all',
      rssCta: 'Follow RSS',
      features: [
        {
          title: 'Key Points Fast',
          description: 'Grasp the highlights and reasoning in 30 seconds.',
        },
        {
          title: 'Precise Filtering',
          description: 'Mix tags, difficulty, and stack to find the perfect reuse.',
        },
        {
          title: 'Official Embed',
          description: 'Clear credit with smoother lazy-loaded embeds.',
        },
      ],
      featuredTitle: "Today's Picks",
      featuredDescription:
        'Six daily picks — three intermediate and three advanced — refreshed at 08:00 CST (UTC+8).',
      viewAll: 'View entire gallery',
      collapse: 'Collapse gallery',
      masonryHint: 'Scroll to explore the full waterfall layout.',
      empty: 'More showcases are on the way — check back after the next sync.',
      devNote:
        'SEO / GEO note: canonical, OpenGraph, JSON-LD, and hreflang are configured. GEO badge relies on client locale.',
    },
    cards: {
      previewPlaceholder: 'Preview coming soon',
      openCodePen: 'Open on CodePen',
      copyLink: 'Copy link',
      copySuccess: 'Link copied',
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
      dateLabel: 'Date',
      tagsLabel: 'Tags',
      allOption: 'All',
      apply: 'Apply filters',
      reset: 'Reset',
      noTags: 'No tags yet',
      showTags: 'Show tags',
      hideTags: 'Hide tags',
      tagsHint: 'Tags stay tucked away until you need them — expand to combine filters by theme.',
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
      difficultyLabel: 'Difficulty',
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
      title: 'All Showcases',
      description:
        'Search title, summary, or analysis; combine tags, difficulty, stack, and date sorting to pinpoint reusable inspiration fast.',
      returnHome: '← Back home',
    },
    status: {
      strapline: 'SparkKit status',
      title: 'Status overview',
      description:
        'Check the live SparkKit build: version, last sync time, and how many showcases are currently published.',
      metrics: {
        versionLabel: 'Build version',
        versionHint: 'Matches the latest deployed batch.',
        syncLabel: 'Last sync',
        syncHint: 'Timestamp for the database pull and page regeneration.',
        indexedLabel: 'Showcases live',
        indexedHint: 'Pens currently included in the sitemap and RSS feed.',
      },
      cacheTitle: 'What ships',
      cacheBody:
        'SparkKit curates front-end experiments with key takeaways, reuse steps, and performance callouts so you can adapt ideas quickly.',
      cacheHitLabel: 'Cache hit rate',
      cachePending: 'Measuring…',
      revalidateProtected: 'Refresh cadence: 08:00 CST',
      cronCadence: 'Languages: 中文 / English',
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
    footer: {
      copyright: '© 2025 SparkKit · CodePen inspiration by VincentK.',
      privacy: 'Privacy policy',
      terms: 'Terms of service',
      support: 'Support',
      compliance: 'Need help with policies? Reach out anytime.',
    },
  },
  zh: {
    nav: {
      home: '首页',
      showcases: '全部作品',
      status: '运行状态',
    },
    landing: {
      strapline: 'Inspire · Decode · Reuse',
      heroTitle: '每天 6 条灵感，直接可复用',
      heroDescription:
        '从「看到酷炫」到「落地复用」，SparkKit 提炼要点、复用步骤与性能提示，省去你翻代码的时间。',
      directoryCta: '浏览全部作品',
      rssCta: '关注 RSS',
      features: [
        {
          title: '要点速读',
          description: '30 秒看懂亮点与原理。',
        },
        {
          title: '标签精搜',
          description: '按主题、难度、技术栈灵活组合。',
        },
        {
          title: '官方嵌入',
          description: '署名清晰，懒加载更顺畅。',
        },
      ],
      featuredTitle: '今日精选',
      featuredDescription: '每日精选 6 条（进阶与高级各 3 条），北京时间 08:00 自动更新。',
      viewAll: '展开全部',
      collapse: '收起',
      masonryHint: '滚动浏览艺术化的瀑布流展示。',
      empty: '更多作品即将上线，欢迎在下一次同步后再来探索。',
      devNote: 'SEO / GEO 说明：已配置 canonical、OpenGraph、JSON-LD 与 hreflang；GEO 徽章基于客户端 locale。',
    },
    cards: {
      previewPlaceholder: '预览即将上线',
      openCodePen: '在 CodePen 打开',
      copyLink: '复制链接',
      copySuccess: '链接已复制',
      untitled: '未命名作品',
      stackFallback: 'Web',
      difficultyFallback: '未标注',
    },
    filters: {
      ariaLabel: '作品筛选器',
      keywordLabel: '关键词',
      keywordPlaceholder: '搜索标题、摘要或解读…',
      stackLabel: '技术栈',
      difficultyLabel: '难度',
      dateLabel: '时间',
      tagsLabel: '标签',
      allOption: '全部',
      apply: '应用筛选',
      reset: '重置',
      noTags: '暂无标签',
      showTags: '展开标签',
      hideTags: '收起标签',
      tagsHint: '标签已折叠，保持界面干净；需要按主题筛选时再展开。',
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
      difficultyLabel: '难度',
      stackLabel: '技术栈',
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
      title: '全部作品',
      description: '搜索标题、摘要或解读，配合标签、难度、技术栈与时间排序快速锁定可复用灵感。',
      returnHome: '← 返回首页',
    },
    status: {
      strapline: 'SparkKit 速览',
      title: '运行状态',
      description: '查看 SparkKit 展示页的版本、最近同步时间与当前上线的作品数量。',
      metrics: {
        versionLabel: '站点版本',
        versionHint: '对应最近一次部署批次。',
        syncLabel: '最近同步',
        syncHint: '数据库读取与页面再生成的时间。',
        indexedLabel: '作品总数',
        indexedHint: '当前 Sitemap 与 RSS 涵盖的作品数量。',
      },
      cacheTitle: '展示内容',
      cacheBody: 'SparkKit 汇集前端实验灵感，并附上要点、复用步骤与性能提示，方便立即借鉴。',
      cacheHitLabel: '缓存命中率',
      cachePending: '统计中',
      revalidateProtected: '日更：北京时间 08:00',
      cronCadence: '语言：中文 / English',
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
    footer: {
      copyright: '© 2025 SparkKit · CodePen inspiration by VincentK.',
      privacy: '隐私政策',
      terms: '服务条款',
      support: '支持',
      compliance: '如需了解政策合规，可随时联系我们。',
    },
  },
};

export function getUiCopy(locale: SupportedLocale): UiCopy {
  return UI_COPY[locale];
}

export type { UiCopy };
