import { useCallback } from 'react';

import { prepareGuestSession } from '@/src/services/session-data';
import { useAppStore } from '@/src/store/app-store';

/** Enter a clean, isolated guest session. */
export function useContinueAsGuest(): () => void {
  const continueAsGuest = useAppStore((state) => state.continueAsGuest);

  return useCallback(() => {
    // Clear account-owned state before enabling guest queries so no protected
    // screen can briefly render data belonging to the previous account.
    prepareGuestSession();
    continueAsGuest();
  }, [continueAsGuest]);
}
