import { useSyncExternalStore } from 'react';

import { getAdsState, subscribeToAdsState } from '@/src/services/ads';

export function useAdsState() {
  return useSyncExternalStore(subscribeToAdsState, getAdsState, getAdsState);
}
