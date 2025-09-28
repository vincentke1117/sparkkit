import { LegalPage } from '@/components/LegalPage';
import { createLegalMetadata } from '@/lib/meta';

export const revalidate = 86_400; // 1 day

export const metadata = createLegalMetadata('support');

export default function SupportPage() {
  return <LegalPage variant="support" />;
}
