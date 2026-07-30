import type { LegalSection } from '@/src/data/legal-types';

export const FAQ_EFFECTIVE_DATE = '30 July 2026';
export const FAQ_VERSION = '1.1';
export const FAQ_OPERATOR = 'Bobble App FAQs';
export const FAQ_INTRO =
  'These frequently asked questions explain how Bobble works and where to get support.';

export const FAQS: LegalSection[] = [
  {
    title: 'What is Bobble?',
    body: 'Bobble is a fun, smart AI app that helps you capture and organise thoughts, ideas, tasks, and those little to big to-do lists!',
  },
  {
    title: 'How do I start a Bobble?',
    body: 'Tap Start Bobbling to record your thoughts.',
  },
  {
    title: 'What happens after I record?',
    body: 'Bobble transcribes and organises your thoughts into a clearer structure, which then you can edit and select what you need.',
  },
  {
    title: 'What does Bobble create?',
    body: 'Bobble may create a summary, tasks, ideas, worries, projects and a suggested next step.',
  },
  {
    title: 'Can I save my Bobbles?',
    body: 'Yes. Saved Bobbles can be reviewed later.',
  },
  {
    title: 'Can I delete a Bobble?',
    body: 'Yes. You can delete Bobbles you no longer want.',
  },
  {
    title: 'Is Bobble always accurate?',
    body: 'No. AI can make mistakes. Always review important details.',
  },
  {
    title: 'Is Bobble therapy?',
    body: 'No. Bobble is not a medical, mental health, counselling or crisis service.',
  },
  {
    title: 'Does Bobble store my data?',
    body: 'Yes, Bobble stores information needed to provide the app and save your Bobbles, see our terms and conditions for details.',
  },
  {
    title: 'Can I delete my account?',
    body: 'Yes. You can request account deletion through the app or by contacting support at support@bobble.au',
  },
  {
    title: 'Who do I contact for help?',
    body: 'Contact us at support@bobble.au.',
  },
];
