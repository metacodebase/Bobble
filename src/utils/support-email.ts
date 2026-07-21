import * as Linking from 'expo-linking';

export const SUPPORT_CONTACT_EMAIL = 'support@bobble.au';
export const BUG_REPORT_EMAIL = 'Dev@bobble.au';

export async function openEmail(
  to: string,
  subject: string,
  body?: string,
): Promise<void> {
  const params = new URLSearchParams();
  params.set('subject', subject);
  if (body) params.set('body', body);

  const url = `mailto:${to}?${params.toString()}`;
  const canOpen = await Linking.canOpenURL(url);
  if (!canOpen) {
    throw new Error('Could not open email app');
  }

  await Linking.openURL(url);
}
