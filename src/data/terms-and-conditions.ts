import type { LegalSection } from '@/src/data/legal-types';

export const TERMS_EFFECTIVE_DATE = '28 July 2026';
export const TERMS_VERSION = '1.0';
export const TERMS_OPERATOR =
  'Operator: N2 Therapy Australia PTY LTD T/A Bobble App, ABN/ACN 16633627219';
export const TERMS_CONTACT = 'Contact: support@bobble.au';
export const TERMS_GOVERNING_LAW = 'Governing Law: New South Wales, Australia';

/** @deprecated Use TERMS_EFFECTIVE_DATE */
export const TERMS_LAST_UPDATED = TERMS_EFFECTIVE_DATE;

export const TERMS_INTRO =
  'WELCOME TO BOBBLE\n\nWe are N2 Therapy Australia Pty Ltd trading as Bobble App, an Australian company with ABN 16 633 627 219 ("we", "our" or "us"). We provide Bobble, an AI-powered voice transcription and personal organisation mobile application that allows users to record voice notes, generate transcripts, summaries, tasks, reminders and goals, and organise and manage that content through the application (App).\n\nThese terms and conditions (Terms) govern your access to and use of the App and any related services we provide through it (Services). The most current version of these Terms is available at [insert URL] (Website).';

export const TERMS_AND_CONDITIONS: LegalSection[] = [
  {
    title: '1. Reading and accepting these Terms',
    body:
      'By creating an Account, clicking an "I accept" button or similar acceptance mechanism, accessing or using the App, purchasing a Paid Subscription or otherwise receiving the benefit of the Services, you agree to be bound by these Terms.\n\nIf you access or use the App on behalf of a company, organisation or other legal entity, you represent and warrant that you have authority to bind that entity to these Terms.\n\nWe may update these Terms from time to time. We will notify you of any material changes through the App, by email or by another reasonable method before those changes take effect. If a change materially disadvantages you, you may cancel your Account or Paid Subscription before the change takes effect and, where you have prepaid Subscription Fees directly to us, receive a pro rata refund for the unused portion of the current billing period.',
  },
  {
    title: '2. Eligibility',
    body:
      'By accepting these Terms or using the App, you represent and warrant that you are at least 16 years old, have legal capacity and authority to enter a binding agreement, and that any information you provide is accurate, complete and current.\n\nIf you are under 18 years old, you must have permission from your parent or legal guardian to create an Account and use the App. You must not create an Account or use the App if you are under 16 years old.',
  },
  {
    title: '3. Duration of these Terms and Paid Subscriptions',
    body:
      'These Terms commence when you first accept them or access or use the App and continue until your Account is closed or these Terms are otherwise terminated.\n\nIf you select a Paid Subscription, it starts when your purchase is confirmed and renews automatically unless cancelled through your payment provider before renewal. Closing your Account does not automatically cancel a Paid Subscription managed by a third-party provider.',
  },
  {
    title: '4. The App and Services',
    body:
      'The Services may include recording voice notes, converting recordings into transcripts, generating summaries, tasks, reminders and goals using automated and AI technologies, and allowing you to organise, edit, export and share content.\n\nAI-generated outputs may be incomplete, inaccurate, delayed or unsuitable. You are responsible for reviewing and verifying outputs before relying on them.\n\nThe App is for personal organisation only and is not legal, financial, medical, psychological, counselling or crisis advice. Do not use the App for emergencies or high-risk scenarios where errors or delays could cause harm.',
  },
  {
    title: '5. Data hosting',
    body:
      'We may store and process User Data using third-party cloud hosting and technology providers, including Amazon Web Services and providers supporting transcription and AI functionality.\n\nUser Data may be stored or processed in Australia and other countries where we or our providers operate. We take reasonable steps to select reputable providers, but no system is completely secure and we cannot guarantee uninterrupted availability or prevent all loss or corruption.\n\nYou are responsible for exporting or retaining copies of important User Data.',
  },
  {
    title: '6. User obligations and prohibited conduct',
    body:
      'You must use the App lawfully, provide accurate information, obtain any required permissions and consents for recordings and personal information, and maintain security of your Account credentials.\n\nYou must not use the App for unlawful, harmful, deceptive or unauthorised purposes; infringe others\' rights; misuse accounts or data; introduce malicious code; reverse engineer or scrape the App; or use outputs in high-risk or emergency contexts.',
  },
  {
    title: '7. Fees and payment',
    body:
      'The Free Plan may include advertising and usage limits. Paid Subscriptions have fees, billing periods and features shown before purchase.\n\nPaid Subscriptions renew automatically unless cancelled before renewal. Cancellation generally takes effect at the end of the current billing period. Refunds for app store purchases are handled by the relevant app store.\n\nWe may change Subscription Fees with notice; changes apply from the next renewal and you may cancel before the new fee takes effect.',
  },
  {
    title: '8. Intellectual property and data',
    body:
      'We own or license all Intellectual Property Rights in the App and Services. You retain rights you hold in your User Data.\n\nYou grant us and our service providers a non-exclusive, worldwide, royalty-free licence to process User Data as reasonably necessary to provide, maintain, secure and improve the Services and comply with law.\n\nWe may create de-identified and aggregated data from User Data and use it for analytics, research, product development, service improvement and related lawful purposes as described in our Privacy Policy.',
  },
  {
    title: '9. Third-party services and integrations',
    body:
      'The App may rely on third-party providers including app stores, payment providers, cloud hosting providers, transcription and AI providers, analytics providers and integrations such as Google Calendar.\n\nYour use of third-party services is also subject to those providers\' own terms and policies. We are not responsible for third-party systems or services outside our control, except where required by law.',
  },
  {
    title: '10. Confidentiality and privacy',
    body:
      'Each party must keep the other party\'s Confidential Information confidential except as permitted by these Terms or required by law.\n\nOur handling of personal information is governed by these Terms and our Privacy Policy, available at [insert URL]. Where applicable law requires consent for specific handling, we will seek it separately.',
  },
  {
    title: '11. Liability and consumer rights',
    body:
      'Nothing in these Terms excludes rights that cannot lawfully be excluded, including rights under the Australian Consumer Law.\n\nTo the maximum extent permitted by law, the App is provided on an "as available" basis, and we do not guarantee uninterrupted or error-free operation or perfect output accuracy.\n\nSubject to law, liability exclusions and limits apply to indirect/consequential loss, and our aggregate liability is limited to the greater of Subscription Fees paid by you in the previous 12 months and AUD $500.',
  },
  {
    title: '12. Plan changes, cancellation and termination',
    body:
      'You may change your Plan through your payment provider. Cancelling a Paid Subscription generally takes effect at the end of the current billing period.\n\nYou may request Account deletion through the App or by contacting support@bobble.au. We may suspend or terminate access where reasonably necessary for breach, legal, security or operational reasons, as permitted by these Terms.\n\nIf we discontinue a Paid Subscription for reasons not caused by your breach, we will provide a pro rata refund for the unused portion of Subscription Fees paid directly to us, subject to law and payment provider processes.',
  },
  {
    title: '13. Dispute resolution and general terms',
    body:
      'If a dispute arises, parties must first try to resolve it in good faith after written notice. If unresolved after 14 days, either party may commence proceedings or pursue available legal remedies.\n\nThese Terms are governed by the laws of [insert Australian State or Territory], Australia, and parties submit to the non-exclusive jurisdiction of courts in that State or Territory.\n\nStandard terms including force majeure, notices, waiver, severability, assignment, entire agreement and interpretation apply.',
  },
  {
    title: '14. Definitions',
    body:
      'Account means an account created by you to access and use the App and Services.\n\nApp means the Bobble mobile application provided by us.\n\nFree Plan means the plan that allows access to specified features without Subscription Fees, and which may be supported by advertising or limits.\n\nPaid Subscription means a paid recurring subscription with additional features or ad removal.\n\nPlan means the Free Plan or a Paid Subscription selected by you.\n\nServices means functionality provided through or in connection with the App, including recording, transcription and AI-generated summaries, tasks, reminders and goals.\n\nUser Data means voice recordings, transcripts, text, files, information and other content you submit to, create through or provide in connection with the App.\n\nWebsite means the website available at [insert URL] and any other website operated by us in connection with the App or Services.',
  },
];
