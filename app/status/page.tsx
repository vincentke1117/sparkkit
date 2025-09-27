import type { Metadata } from 'next';

import { StatusPageContent } from '@/components/StatusPageContent';
import { createStatusMetadata } from '@/lib/meta';
import { fetchSyncStatus } from '@/lib/supabase';

export const revalidate = 300; // 5 minutes

export const metadata: Metadata = createStatusMetadata();

export default async function StatusPage() {
  const status = await fetchSyncStatus();
  return <StatusPageContent status={status} />;
}
