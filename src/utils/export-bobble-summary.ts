import * as Clipboard from 'expo-clipboard';
import Share from 'react-native-share';

import type { Bobble } from '@/src/features/bobbles/types';
import { formatBobbleSummaryExport } from '@/src/utils/bobble-actions';

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

export async function exportBobbleSummary(
  bobble: Bobble,
  options?: { dateLabel?: string; durationMin?: number },
): Promise<'shared' | 'copied'> {
  const message = formatBobbleSummaryExport(bobble, options);
  if (!message) {
    throw new Error('Nothing to export for this bobble.');
  }

  try {
    await Share.open({
      title: bobble.title,
      subject: bobble.title,
      message,
    });
    return 'shared';
  } catch (error) {
    if (isShareCancelled(error)) {
      throw error;
    }

    await Clipboard.setStringAsync(message);
    return 'copied';
  }
}
