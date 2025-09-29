import { LegalPage } from '@/components/LegalPage';
import { createLegalMetadata } from '@/lib/meta';

export const revalidate = 86_400; // 1 day

export const metadata = createLegalMetadata('privacy');

export default function PrivacyPage() {
  return <LegalPage variant="privacy" />;
}
