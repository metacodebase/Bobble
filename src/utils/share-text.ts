import * as Clipboard from 'expo-clipboard';
import Share from 'react-native-share';

function isShareCancelled(error: unknown): boolean {
  if (!(error instanceof Error)) return false;
  const message = error.message.toLowerCase();
  return (
    message.includes('cancel') ||
    message.includes('dismiss') ||
    message.includes('did not share') ||
    message.includes('user denied')
  );
}

export async function sharePlainText(options: {
  title: string;
  message: string;
  url?: string;
}): Promise<'shared' | 'copied'> {
  try {
    await Share.open({
      title: options.title,
      subject: options.title,
      message: options.message,
      ...(options.url ? { url: options.url } : {}),
    });
    return 'shared';
  } catch (error) {
    if (isShareCancelled(error)) {
      throw error;
    }
    await Clipboard.setStringAsync(options.url ? `${options.message}\n${options.url}` : options.message);
    return 'copied';
  }
}
