import { LegalDocumentScreen } from '@/src/components/legal/legal-document-screen';
import {
  FAQ_EFFECTIVE_DATE,
  FAQ_INTRO,
  FAQ_OPERATOR,
  FAQ_VERSION,
  FAQS,
} from '@/src/data/faq';

export default function FaqScreen() {
  return (
    <LegalDocumentScreen
      title="FAQ"
      effectiveDate={FAQ_EFFECTIVE_DATE}
      version={FAQ_VERSION}
      operator={FAQ_OPERATOR}
      intro={FAQ_INTRO}
      sections={FAQS}
    />
  );
}
