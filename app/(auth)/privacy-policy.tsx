import { LegalDocumentScreen } from '@/src/components/legal/legal-document-screen';
import {
  PRIVACY_ADDRESS,
  PRIVACY_CONTACT,
  PRIVACY_EFFECTIVE_DATE,
  PRIVACY_INTRO,
  PRIVACY_OPERATOR,
  PRIVACY_POLICY,
  PRIVACY_VERSION,
} from '@/src/data/privacy-policy';

export default function AuthPrivacyPolicyScreen() {
  return (
    <LegalDocumentScreen
      title="Privacy Policy"
      effectiveDate={PRIVACY_EFFECTIVE_DATE}
      version={PRIVACY_VERSION}
      operator={PRIVACY_OPERATOR}
      contactLine={`${PRIVACY_CONTACT}\n${PRIVACY_ADDRESS}`}
      intro={PRIVACY_INTRO}
      sections={PRIVACY_POLICY}
    />
  );
}
