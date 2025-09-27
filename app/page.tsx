import { HomeLanding } from '@/components/HomeLanding';
import { createHomeMetadata, DAILY_FEATURE_COUNT } from '@/lib/meta';
import { fetchShowcases } from '@/lib/supabase';

export const revalidate = 1800; // 30 minutes cache for landing page

export const metadata = createHomeMetadata();

export default async function HomePage() {
  const showcases = await fetchShowcases({ limit: DAILY_FEATURE_COUNT * 3, order: 'latest' });
  const isProduction = process.env.NODE_ENV === 'production';

  return <HomeLanding showcases={showcases} showDevNote={!isProduction} />;
}
