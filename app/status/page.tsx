import type { Metadata } from 'next';

import { StatusPageContent } from '@/components/StatusPageContent';
import { fetchSyncStatus } from '@/lib/supabase';
import { getSiteUrl } from '@/lib/site';

export const revalidate = 300; // 5 minutes

export const metadata: Metadata = {
  title: '运行状态',
  description: '查看 SparkKit 的版本、最近同步时间、已索引条目与缓存表现。',
  alternates: {
    canonical: getSiteUrl('/status'),
    languages: {
      'en-US': getSiteUrl('/status'),
      'zh-CN': getSiteUrl('/status?hl=zh-cn'),
      'x-default': getSiteUrl('/status'),
    },
  },
};

export default async function StatusPage() {
  const status = await fetchSyncStatus();
  return <StatusPageContent status={status} />;
}
