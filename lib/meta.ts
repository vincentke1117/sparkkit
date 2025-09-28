import type { Metadata } from 'next';

import { getLocalizedText } from './i18n';
import type { LegalVariant } from './legal';
import type { ShowcaseRecord } from './types';
import { getOgImageUrl, getSiteUrl } from './site';

export const BRAND_NAME = '灵点集 · SparkKit';
export const DAILY_FEATURE_COUNT = 6;

const TWITTER_HANDLE = '@sparkkit';
const TITLE_SUFFIX = ' · SparkKit · spark.vincentke.cc';
const TITLE_MIN_LENGTH = 24;
const TITLE_MAX_LENGTH = 34;
const TITLE_FILLER = ' 精选拆解';
const DESCRIPTION_MIN_LENGTH = 150;
const DESCRIPTION_MAX_LENGTH = 160;
const DESCRIPTION_FILLER = ' 欢迎收藏 SparkKit，获取每日灵感更新。';

function toChars(value: string): string[] {
  return Array.from(value);
}

function ensureRange(value: string, min: number, max: number, filler: string): string {
  let output = value.trim();

  if (!output) {
    output = 'SparkKit 精选灵感导航';
  }

  let chars = toChars(output);

  if (chars.length > max) {
    output = chars.slice(0, max).join('');
    chars = toChars(output);
  }

  while (chars.length < min) {
    output = `${output}${filler}`;
    chars = toChars(output);

    if (chars.length > max) {
      output = chars.slice(0, max).join('');
      break;
    }
  }

  return output;
}

function composeTitle(main: string): string {
  const normalized = ensureRange(main.replace(/\s+/g, ' ').trim(), TITLE_MIN_LENGTH, TITLE_MAX_LENGTH, TITLE_FILLER);
  return `${normalized}${TITLE_SUFFIX}`;
}

function composeDescription(base: string): string {
  let normalized = base.replace(/\s+/g, ' ').trim();

  if (!normalized) {
    normalized =
      'SparkKit 提供 CodePen 灵感的亮点拆解、复用步骤与性能提示，帮助团队快速应用前端创意并保持展示站点持续更新。';
  }

  let chars = toChars(normalized);

  if (chars.length > DESCRIPTION_MAX_LENGTH) {
    normalized = chars.slice(0, DESCRIPTION_MAX_LENGTH).join('');
    chars = toChars(normalized);
  }

  while (chars.length < DESCRIPTION_MIN_LENGTH) {
    normalized = `${normalized}${DESCRIPTION_FILLER}`;
    chars = toChars(normalized);

    if (chars.length > DESCRIPTION_MAX_LENGTH) {
      normalized = chars.slice(0, DESCRIPTION_MAX_LENGTH).join('');
      break;
    }
  }

  return normalized;
}

function createSharedMeta({
  title,
  description,
  canonical,
  type = 'website',
  ogImage = getOgImageUrl(),
  robots,
}: {
  title: string;
  description: string;
  canonical: string;
  type?: 'website' | 'article';
  ogImage?: string;
  robots?: Metadata['robots'];
}): Metadata {
  return {
    title,
    description,
    alternates: {
      canonical,
      languages: {
        'zh-CN': canonical,
        'en-US': `${canonical}?hl=en`,
        'x-default': canonical,
      },
    },
    openGraph: {
      type,
      url: canonical,
      title,
      description,
      images: [
        {
          url: ogImage,
          width: 1200,
          height: 630,
          alt: title,
        },
      ],
      siteName: BRAND_NAME,
    },
    twitter: {
      card: 'summary_large_image',
      site: TWITTER_HANDLE,
      title,
      description,
      images: [ogImage],
    },
    robots,
  };
}

export function createHomeMetadata(): Metadata {
  const title = composeTitle('每日6条前端灵感随取随用，深度解析即刻复用全指南');
  const description = composeDescription(
    `每日 ${DAILY_FEATURE_COUNT} 条 CodePen 前端灵感搭配亮点拆解、复用步骤与性能提示，减少探索成本。支持按标签、技术栈、难度筛选，并提供官方嵌入、站点地图与 RSS 订阅让团队随时掌握最新灵感。精选案例覆盖动画、交互与数据可视化，帮助你在项目迭代中快速落地创意与复用方案，并结合性能提示确保上线体验稳定。立即关注掌握最新前端灵感趋势。`
  );
  const canonical = getSiteUrl('/');

  return createSharedMeta({ title, description, canonical });
}

export function createListMetadata(pathname = '/showcases'): Metadata {
  const title = composeTitle('全部作品灵感库每日更新，标签难度随心组合智能检索');
  const description = composeDescription(
    '按标题、摘要、亮点解读搜索所有 CodePen 灵感，并结合标签、技术栈、难度、发布时间筛选，快速锁定适合的实验素材。每 15 分钟增量刷新列表，配合站点地图与 RSS 保障索引更新。浏览卡片即可获取作者、复用提示与原链接，方便团队即刻实践，并支持一键复制分享给同事，加速评审与落地效率，保持灵感库高质量曝光。'
  );
  const canonical = getSiteUrl(pathname);

  return createSharedMeta({ title, description, canonical });
}

export function createSearchMetadata(): Metadata {
  const title = composeTitle('灵感搜索结果实时筛选，助你快速定位复用方向全指南');
  const description = composeDescription(
    '输入关键词即可即时筛选 CodePen 灵感，结合标签、技术栈、难度与发布时间过滤，快速缩小结果范围。搜索结果每 15 分钟更新，保留作者、摘要、复用提示与原链接，方便团队复制链接分享，保障灵感库检索体验稳定可靠，并支持按需复制外链或跳转 CodePen 预览，确保跨团队协作顺畅，持续掌握灵感动态。'
  );
  const canonical = getSiteUrl('/search');

  return createSharedMeta({ title, description, canonical });
}

export function createStatusMetadata(): Metadata {
  const title = composeTitle('运行状态与更新节奏总览，掌握最新灵感发布节拍指南');
  const description = composeDescription(
    '查看 SparkKit 展示站的部署版本、最近同步时间与当前上线作品数量，监控每日 08:00 刷新的精选灵感批次。记录站点地图与 RSS 生成状态、缓存命中情况与数据来源，便于团队快速排查更新节奏并保持展示准确，并提供手动刷新指引与异常提示，帮助及时响应内容更新需求，确保只读展示站稳定服务产品决策。'
  );
  const canonical = getSiteUrl('/status');

  return createSharedMeta({
    title,
    description,
    canonical,
    robots: {
      index: false,
      follow: false,
      nocache: true,
    },
  });
}

const LEGAL_META: Record<LegalVariant, { path: string; mainTitle: string; description: string }> = {
  privacy: {
    path: '/privacy',
    mainTitle: '隐私政策与数据使用透明说明守护信任承诺全指南',
    description:
      '了解 SparkKit 如何缓存 CodePen 数据、处理日志与联系信息，并在只读部署中保护访问者隐私。文档覆盖数据保留周期、第三方依赖、Cookie 使用与联系我们的方式，帮助团队满足广告与合规审核要求，并提供申请数据删除、反馈隐私问题的渠道，确保体验安全透明，同时列出隐私政策更新的生效日期与联系邮箱。',
  },
  terms: {
    path: '/terms',
    mainTitle: '服务条款与署名规范，确保灵感合规复用全流程执行指南',
    description:
      '了解 SparkKit 的使用范围、署名规范与内容引用要求，确保你在分享 CodePen 灵感与解读时遵循原作者授权。条款覆盖禁止行为、服务可用性、免责声明与法律适用，帮助团队在协作中保持透明责任，并列出联系方式、条款变更通知方式与争议解决路径，降低合规风险，确保项目协作在明确边界下稳健推进，欢迎定期回顾更新。',
  },
  support: {
    path: '/support',
    mainTitle: '支持与联系渠道，解答常见运营合规问题实操全流程指南',
    description:
      '快速了解如何联系 SparkKit 团队、获取广告与隐私支持，并查看常见问题的处理建议。页面涵盖联系表单、响应时间、合作渠道与反馈路径，同时给出站点地图、RSS 与更新节奏说明，帮助你顺利对接只读展示站运营，并提供订阅与社群建议，保障合作沟通顺畅，也列出紧急情况处理方式以提升响应效率，欢迎随时联系获取最新路线图。',
  },
};

export function createLegalMetadata(variant: LegalVariant): Metadata {
  const config = LEGAL_META[variant];
  const title = composeTitle(config.mainTitle);
  const description = composeDescription(config.description);
  const canonical = getSiteUrl(config.path);

  return createSharedMeta({
    title,
    description,
    canonical,
    ogImage: getOgImageUrl(),
  });
}

function composeDetailTitle(rawTitle: string): string {
  const base = `${rawTitle} 解读与复用要点全指南`;
  const normalized = ensureRange(base, TITLE_MIN_LENGTH, TITLE_MAX_LENGTH, ' 精选拆解');
  return `${normalized}${TITLE_SUFFIX}`;
}

export function createDetailMetadata(record: ShowcaseRecord): Metadata {
  const zhTitle = getLocalizedText(record, 'title', 'zh');
  const enTitle = getLocalizedText(record, 'title', 'en');
  const fallbackTitle = `${record.pen_user}/${record.pen_slug}`;
  const titleSource = zhTitle ?? enTitle ?? fallbackTitle;
  const composedTitle = composeDetailTitle(titleSource);
  const summaryZh = getLocalizedText(record, 'summary', 'zh');
  const summaryEn = getLocalizedText(record, 'summary', 'en');
  const description = composeDescription(
    `${summaryZh ?? summaryEn ?? ''} 包含作者信息、亮点拆解、复用步骤与性能提示，配合官方 CodePen 嵌入帮助团队快速实践，并支持复制链接分享至协作工具。`
  );
  const detailPath = `/p/${record.pen_user}/${record.pen_slug}`;
  const canonical = getSiteUrl(detailPath);
  const image = record.thumbnail_url ?? getOgImageUrl();
  const publishedTime = record.created_at ?? undefined;
  const baseMeta = createSharedMeta({
    title: composedTitle,
    description,
    canonical,
    type: 'article',
    ogImage: image,
  });

  return {
    ...baseMeta,
    openGraph: {
      ...baseMeta.openGraph,
      type: 'article',
      authors: record.author_name ? [record.author_name] : undefined,
      publishedTime,
      tags: record.tags ?? undefined,
    },
    twitter: {
      ...baseMeta.twitter,
      site: TWITTER_HANDLE,
    },
  };
}
