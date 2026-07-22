import { LegalDocumentScreen } from '@/src/components/legal/legal-document-screen';
import {
  TERMS_AND_CONDITIONS,
  TERMS_CONTACT,
  TERMS_EFFECTIVE_DATE,
  TERMS_GOVERNING_LAW,
  TERMS_INTRO,
  TERMS_OPERATOR,
  TERMS_VERSION,
} from '@/src/data/terms-and-conditions';

export default function SettingsTermsAndConditionsScreen() {
  return (
    <LegalDocumentScreen
      title="Terms of Use"
      effectiveDate={TERMS_EFFECTIVE_DATE}
      version={TERMS_VERSION}
      operator={TERMS_OPERATOR}
      contactLine={`${TERMS_CONTACT}\n${TERMS_GOVERNING_LAW}`}
      intro={TERMS_INTRO}
      sections={TERMS_AND_CONDITIONS}
    />
  );
}
