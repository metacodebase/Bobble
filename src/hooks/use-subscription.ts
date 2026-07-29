import { useCallback, useMemo } from 'react';
import { useQueryClient } from '@tanstack/react-query';

import {
  DEFAULT_SUBSCRIPTION,
  planLabelForProductId,
  type UserSubscription,
} from '@/src/config/subscription';
import { useMe } from '@/src/hooks/api';
import { authApi } from '@/src/api';
import { queryKeys } from '@/src/services/query-keys';
import { useAppStore } from '@/src/store/app-store';

export function useSubscription(): UserSubscription {
  const storeUser = useAppStore((s) => s.user);
  const { data: me } = useMe();
  return me?.subscription ?? storeUser?.subscription ?? DEFAULT_SUBSCRIPTION;
}

export function useIsPro(): boolean {
  return useSubscription().isPro === true;
}

export function usePlanLabel(): string {
  const subscription = useSubscription();
  return useMemo(() => {
    if (!subscription.isPro) return 'Free';
    return planLabelForProductId(subscription.productId);
  }, [subscription.isPro, subscription.productId]);
}

/**
 * Refetch /auth/me (and briefly poll) so webhook-updated Pro status lands in the UI.
 */
export function useRefreshSubscription() {
  const qc = useQueryClient();
  const setUser = useAppStore((s) => s.setUser);

  return useCallback(
    async (opts?: { pollUntilPro?: boolean; attempts?: number; intervalMs?: number }) => {
      const attempts = opts?.attempts ?? (opts?.pollUntilPro ? 6 : 1);
      const intervalMs = opts?.intervalMs ?? 800;

      for (let i = 0; i < attempts; i += 1) {
        try {
          const user = await authApi.fetchMe();
          setUser(user);
          qc.setQueryData(queryKeys.auth.me, user);
          if (!opts?.pollUntilPro || user.subscription?.isPro) {
            return user;
          }
        } catch {
          /* keep polling */
        }
        if (i < attempts - 1) {
          await new Promise((resolve) => setTimeout(resolve, intervalMs));
        }
      }

      return useAppStore.getState().user;
    },
    [qc, setUser]
  );
}
