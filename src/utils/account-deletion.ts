import { Href, router } from 'expo-router';
import { Alert } from 'react-native';

export const ACCOUNT_DELETION_SUCCESS =
  'Your account and database data were deleted. Original voice recordings remain retained under the Privacy Policy.';

export const DEMO_DELETION_SUCCESS =
  'Demo session data was cleared from this device. No server account, database data, or stored voice recordings were deleted.';

export function confirmAccountDeletion(onDelete: () => void, isOffline: boolean) {
  const message = isOffline
    ? 'This demo action only signs you out and clears session data on this device. It does not delete a server account, database data, or stored voice recordings.'
    : 'Your account and database records will be permanently deleted or de-identified from active systems within 30 days. Original voice recordings are currently retained in Amazon S3 under our Privacy Policy.';

  Alert.alert('Delete account', message, [
    { text: 'Cancel', style: 'cancel' },
    {
      text: 'Data retention policy',
      onPress: () => router.push('/settings/data-retention' as Href),
    },
    { text: isOffline ? 'Clear demo session' : 'Delete', style: 'destructive', onPress: onDelete },
  ]);
}
