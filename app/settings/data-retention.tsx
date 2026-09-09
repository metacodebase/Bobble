import { LegalDocumentScreen } from '@/src/components/legal/legal-document-screen';
import {
  PRIVACY_EFFECTIVE_DATE,
  PRIVACY_INTRO,
  PRIVACY_OPERATOR,
  PRIVACY_POLICY,
  PRIVACY_VERSION,
} from '@/src/data/privacy-policy';

export default function DataRetentionPolicyScreen() {
  return (
    <LegalDocumentScreen
      title="Data Retention"
      effectiveDate={PRIVACY_EFFECTIVE_DATE}
      version={PRIVACY_VERSION}
      operator={PRIVACY_OPERATOR}
      intro={PRIVACY_INTRO}
      sections={PRIVACY_POLICY.filter((section) => section.title.startsWith('11 '))}
    />
  );
}
