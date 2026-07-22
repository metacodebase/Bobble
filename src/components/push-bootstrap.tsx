import { usePushNotificationsBootstrap } from '@/src/hooks/use-notifications';
import { BACKEND_ALLOWED } from '@/src/config/backend';

/** Registers push tokens and notification tap handlers after sign-in. */
export function PushBootstrap() {
  usePushNotificationsBootstrap(BACKEND_ALLOWED);
  return null;
}
