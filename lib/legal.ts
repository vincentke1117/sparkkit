import { SupportedLocale } from './i18n';

export type LegalVariant = 'privacy' | 'terms' | 'support';

export type LegalSection = {
  title: string;
  body: string[];
};

export type LegalEntry = {
  title: string;
  updated: string;
  intro: string;
  sections: LegalSection[];
};

const LEGAL_CONTENT: Record<SupportedLocale, Record<LegalVariant, LegalEntry>> = {
  en: {
    privacy: {
      title: 'Privacy policy',
      updated: 'Updated: Jan 10, 2025',
      intro:
        'SparkKit only reads public showcase data from Supabase and does not collect personal information beyond the analytics you choose to enable.',
      sections: [
        {
          title: 'What we store',
          body: [
            'We cache showcase metadata (title, summary, tags, preview assets) in order to render pages quickly. No user accounts or tracking profiles are created.',
            'If you subscribe to RSS or contact us by email, we only keep the information you provide for that purpose.',
          ],
        },
        {
          title: 'Analytics & cookies',
          body: [
            'SparkKit currently runs without marketing cookies. If we enable privacy-friendly analytics in the future, we will update this page before deployment.',
          ],
        },
        {
          title: 'Contact',
          body: ['Reach out via the Support page if you need data removal or have compliance questions.'],
        },
      ],
    },
    terms: {
      title: 'Terms of service',
      updated: 'Updated: Sep 28, 2025',
      intro:
        'By browsing SparkKit you agree to use the showcases for inspiration and respect the original authors\' licenses on CodePen.',
      sections: [
        {
          title: 'Use of content',
          body: [
            'SparkKit provides commentary and links to the original CodePen works. Please attribute the author and follow any license terms specified in the source.',
          ],
        },
        {
          title: 'No warranties',
          body: [
            'The site is delivered as-is. We do not guarantee the availability, correctness, or continued existence of external resources.',
          ],
        },
        {
          title: 'Changes',
          body: ['We may revise these terms as the site evolves. Continued use after updates implies acceptance of the new terms.'],
        },
      ],
    },
    support: {
      title: 'Support',
      updated: 'Updated: Jan 10, 2025',
      intro:
        'Questions about compliance, AdSense, or feature requests? Let us know and we\'ll respond within two business days.',
      sections: [
        {
          title: 'Contact channels',
          body: [
            'Email: vincentxai2025@gmail.com',
            'GitHub: https://github.com/vincentke1117/sparkkit',
            'Twitter: https://x.com/VK_Vibing (@VK_Vibing)',
          ],
        },
        {
          title: 'Advertising & monetization',
          body: [
            'Before enabling Google AdSense, ensure that your privacy policy and terms of service remain accessible in the footer and that content complies with the AdSense Program policies.',
          ],
        },
      ],
    },
  },
  zh: {
    privacy: {
      title: '隐私政策',
      updated: '更新日期：2025-01-10',
      intro: 'SparkKit 仅从 Supabase 读取公开的作品数据，不额外收集个人信息，除非你主动提供。',
      sections: [
        {
          title: '我们存储的内容',
          body: [
            '为提升页面加载速度，我们会缓存作品的标题、摘要、标签与预览资源。不创建任何用户账号，也不会建立追踪档案。',
            '如果你订阅 RSS 或通过邮件联系我们，我们只会为对应目的保存你提供的信息。',
          ],
        },
        {
          title: '分析与 Cookie',
          body: [
            '目前站点未启用营销类 Cookie。若未来接入更注重隐私的分析工具，我们会在上线前更新本页说明。',
          ],
        },
        {
          title: '联系方式',
          body: ['如需删除数据或咨询合规问题，请通过支持页与我们联系。'],
        },
      ],
    },
    terms: {
      title: '服务条款',
      updated: '更新日期：2025-09-28',
      intro: '访问 SparkKit 表示你同意仅将作品用于学习与灵感延展，并尊重 CodePen 原作者的授权条款。',
      sections: [
        {
          title: '内容使用',
          body: ['SparkKit 提供解读与链接，引用作品时请注明作者，并遵守原链接标注的许可协议。'],
        },
        {
          title: '责任声明',
          body: ['本站以“现状”提供，不保证外部资源的可用性、准确性或持续存在。'],
        },
        {
          title: '条款更新',
          body: ['随着站点演进，我们可能更新条款。继续使用即视为接受新的条款。'],
        },
      ],
    },
    support: {
      title: '支持',
      updated: '更新日期：2025-01-10',
      intro: '关于合规、AdSense 或功能建议，欢迎留言，我们会在两个工作日内回复。',
      sections: [
        {
          title: '联系方式',
          body: [
            '邮箱：vincentxai2025@gmail.com',
            'GitHub：https://github.com/vincentke1117/sparkkit',
            'Twitter：@VK_Vibing（https://x.com/VK_Vibing）',
          ],
        },
        {
          title: '广告与变现',
          body: ['启用 Google AdSense 前，请确保页脚持续展示隐私政策与服务条款，并遵循 AdSense 计划政策。'],
        },
      ],
    },
  },
};

export function getLegalContent(locale: SupportedLocale, variant: LegalVariant): LegalEntry {
  const localized = LEGAL_CONTENT[locale];
  if (localized && localized[variant]) {
    return localized[variant];
  }
  return LEGAL_CONTENT.en[variant];
}
