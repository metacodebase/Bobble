import { BACKEND_ALLOWED } from '@/src/config/backend';
import { useAppStore } from '@/src/store/app-store';

/** Guest sessions stay entirely on-device and never call the account API. */
export function shouldUseOfflineData(): boolean {
  return !BACKEND_ALLOWED || useAppStore.getState().isGuest;
}
