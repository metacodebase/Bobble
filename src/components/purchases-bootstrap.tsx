import { useEffect, useRef } from 'react';
import { AppState, Platform } from 'react-native';
import Purchases, { type CustomerInfo } from 'react-native-purchases';

import { authApi } from '@/src/api';
import {
  configurePurchases,
  loginPurchases,
  logoutPurchases,
  subscriptionFromCustomerInfo,
} from '@/src/services/purchases';
import { queryClient } from '@/src/services/query-client';
import { queryKeys } from '@/src/services/query-keys';
import { useAppStore } from '@/src/store/app-store';

/**
 * Configures RevenueCat once (preferring known App User ID) and keeps identity
 * synced with auth so purchases never attach to an anonymous RC user.
 * After identity is ready, pulls authoritative Pro status/store into backend + app.
 */
export function PurchasesBootstrap() {
  const hasHydrated = useAppStore((s) => s.hasHydrated);
  const isAuthenticated = useAppStore((s) => s.isAuthenticated);
  const userId = useAppStore((s) => s.user?._id ?? null);
  const lastUserIdRef = useRef<string | null>(null);

  useEffect(() => {
    if (!hasHydrated) return;
    if (Platform.OS !== 'ios' && Platform.OS !== 'android') return;

    let cancelled = false;
    let removeCustomerInfoListener: (() => void) | null = null;
    let removeAppStateListener: (() => void) | null = null;

    void (async () => {
      const knownUserId = isAuthenticated && userId ? userId : undefined;
      await configurePurchases(knownUserId);
      if (cancelled) return;

      if (knownUserId) {
        const applyCustomerInfo = (customerInfo: CustomerInfo | null) => {
          if (cancelled) return null;
          const nativeSubscription = subscriptionFromCustomerInfo(customerInfo);
          if (!nativeSubscription) return null;

          const currentUser = useAppStore.getState().user;
          if (!currentUser || currentUser._id !== knownUserId) return nativeSubscription;

          const nextUser = { ...currentUser, subscription: nativeSubscription };
          useAppStore.getState().setUser(nextUser);
          queryClient.setQueryData(queryKeys.auth.me, nextUser);
          return nativeSubscription;
        };

        const reconcileSubscription = async (customerInfo: CustomerInfo | null) => {
          const nativeSubscription = applyCustomerInfo(customerInfo);
          try {
            const serverUser = await authApi.syncSubscription();
            if (cancelled) return;

            // RevenueCat's active native entitlement unlocks immediately. A
            // delayed webhook/REST sync must not overwrite it with stale Free.
            const nextUser =
              nativeSubscription?.isPro && !serverUser.subscription?.isPro
                ? { ...serverUser, subscription: nativeSubscription }
                : serverUser;
            useAppStore.getState().setUser(nextUser);
            queryClient.setQueryData(queryKeys.auth.me, nextUser);
          } catch {
            // Native CustomerInfo remains available while backend reconciliation
            // catches up through REST or the RevenueCat webhook.
          }
        };

        const customerInfo = await loginPurchases(knownUserId);
        if (cancelled) return;
        lastUserIdRef.current = knownUserId;

        const customerInfoListener = (updatedInfo: CustomerInfo) => {
          void reconcileSubscription(updatedInfo);
        };
        Purchases.addCustomerInfoUpdateListener(customerInfoListener);
        removeCustomerInfoListener = () => {
          Purchases.removeCustomerInfoUpdateListener(customerInfoListener);
        };

        let previousAppState = AppState.currentState;
        const appStateSubscription = AppState.addEventListener('change', (nextState) => {
          const returnedToForeground = previousAppState !== 'active' && nextState === 'active';
          previousAppState = nextState;
          if (!returnedToForeground || cancelled) return;

          void (async () => {
            try {
              // Purchases made or changed in Apple's/Google's external UI can
              // otherwise remain behind RevenueCat's cached CustomerInfo.
              await Purchases.invalidateCustomerInfoCache();
              const refreshedInfo = await Purchases.getCustomerInfo();
              await reconcileSubscription(refreshedInfo);
            } catch (error) {
              if (__DEV__) console.warn('[purchases] foreground refresh failed', error);
            }
          })();
        });
        removeAppStateListener = () => appStateSubscription.remove();

        await reconcileSubscription(customerInfo);
        return;
      }

      if (lastUserIdRef.current) {
        lastUserIdRef.current = null;
        await logoutPurchases();
      }
    })();

    return () => {
      cancelled = true;
      removeCustomerInfoListener?.();
      removeAppStateListener?.();
    };
  }, [hasHydrated, isAuthenticated, userId]);

  return null;
}
