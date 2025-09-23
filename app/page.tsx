import { HomeLanding } from '@/components/HomeLanding';
import { fetchShowcases } from '@/lib/supabase';

export const revalidate = 1800; // 30 minutes cache for landing page

export default async function HomePage() {
  const showcases = await fetchShowcases({ limit: 18 });
  const isProduction = process.env.NODE_ENV === 'production';

  return <HomeLanding showcases={showcases} showDevNote={!isProduction} />;
}
