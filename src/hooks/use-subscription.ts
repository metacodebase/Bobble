import { useCallback, useEffect, useMemo, useState } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import type { CustomerInfo } from 'react-native-purchases';

import {
  DEFAULT_SUBSCRIPTION,
  planLabelForProductId,
  type UserSubscription,
} from '@/src/config/subscription';
import { useMe } from '@/src/hooks/api';
import { authApi } from '@/src/api';
import { queryKeys } from '@/src/services/query-keys';
import {
  ensurePurchasesIdentity,
  isPurchasesIdentityReady,
  isPurchasesSupported,
  subscriptionFromCustomerInfo,
} from '@/src/services/purchases';
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
 * True once RevenueCat is configured and logged in as the current Mongo user.
 * Paywall should wait on this before purchase/restore.
 */
export function usePurchasesIdentityReady(): boolean {
  const userId = useAppStore((s) => s.user?._id ?? null);
  const isAuthenticated = useAppStore((s) => s.isAuthenticated);
  const [ready, setReady] = useState(() =>
    Boolean(userId && isPurchasesIdentityReady(userId))
  );

  useEffect(() => {
    if (!isPurchasesSupported() || !isAuthenticated || !userId) {
      setReady(false);
      return;
    }

    let cancelled = false;
    setReady(isPurchasesIdentityReady(userId));

    void (async () => {
      const ok = await ensurePurchasesIdentity(userId);
      if (!cancelled) setReady(ok);
    })();

    return () => {
      cancelled = true;
    };
  }, [isAuthenticated, userId]);

  return ready;
}

/**
 * Refetch /auth/me (and briefly poll) so webhook-updated Pro status lands in the UI.
 * Prefer syncing via /auth/sync-subscription first when RevenueCat API key is set.
 */
export function useRefreshSubscription() {
  const qc = useQueryClient();
  const setUser = useAppStore((s) => s.setUser);

  return useCallback(
    async (opts?: {
      pollUntilPro?: boolean;
      attempts?: number;
      intervalMs?: number;
      /** Call POST /auth/sync-subscription before polling /me (default true). */
      syncFromRevenueCat?: boolean;
      /** Native SDK result used to update the UI while backend sync catches up. */
      customerInfo?: CustomerInfo;
    }) => {
      const attempts = opts?.attempts ?? (opts?.pollUntilPro ? 6 : 1);
      const intervalMs = opts?.intervalMs ?? 800;
      const syncFromRevenueCat = opts?.syncFromRevenueCat !== false;
      const nativeSubscription = subscriptionFromCustomerInfo(opts?.customerInfo);

      // RevenueCat's purchase/restore result is authoritative for client access.
      // Keep server-side enforcement separate and reconcile it below.
      if (nativeSubscription) {
        const currentUser = useAppStore.getState().user;
        if (currentUser) {
          const optimisticUser = { ...currentUser, subscription: nativeSubscription };
          setUser(optimisticUser);
          qc.setQueryData(queryKeys.auth.me, optimisticUser);
        }
      }

      for (let i = 0; i < attempts; i += 1) {
        try {
          // Retry the reconciliation itself. Polling /me alone cannot change a
          // stale subscription when the webhook or Play propagation is delayed.
          const user = syncFromRevenueCat
            ? await authApi.syncSubscription()
            : await authApi.fetchMe();
          const keepNativePro = nativeSubscription?.isPro && !user.subscription?.isPro;
          if (!keepNativePro) {
            setUser(user);
            qc.setQueryData(queryKeys.auth.me, user);
          }
          if (!opts?.pollUntilPro || user.subscription?.isPro) {
            return keepNativePro
              ? { ...user, subscription: nativeSubscription }
              : user;
          }
        } catch {
          // A webhook may still update /me even if direct reconciliation failed.
          try {
            const user = await authApi.fetchMe();
            const keepNativePro = nativeSubscription?.isPro && !user.subscription?.isPro;
            if (!keepNativePro) {
              setUser(user);
              qc.setQueryData(queryKeys.auth.me, user);
            }
            if (!opts?.pollUntilPro || user.subscription?.isPro) return user;
          } catch {
            /* keep polling */
          }
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
