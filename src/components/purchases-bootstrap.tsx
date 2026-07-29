import { useEffect, useRef } from 'react';
import { Platform } from 'react-native';

import {
  configurePurchases,
  loginPurchases,
  logoutPurchases,
} from '@/src/services/purchases';
import { useAppStore } from '@/src/store/app-store';

/**
 * Configures RevenueCat once and keeps the App User ID synced with auth.
 */
export function PurchasesBootstrap() {
  const hasHydrated = useAppStore((s) => s.hasHydrated);
  const isAuthenticated = useAppStore((s) => s.isAuthenticated);
  const userId = useAppStore((s) => s.user?._id ?? null);
  const configuredRef = useRef(false);
  const lastUserIdRef = useRef<string | null>(null);

  useEffect(() => {
    if (!hasHydrated) return;
    if (Platform.OS !== 'ios' && Platform.OS !== 'android') return;

    let cancelled = false;

    void (async () => {
      await configurePurchases();
      if (cancelled) return;
      configuredRef.current = true;

      if (isAuthenticated && userId) {
        await loginPurchases(userId);
        lastUserIdRef.current = userId;
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [hasHydrated]);

  useEffect(() => {
    if (!hasHydrated || !configuredRef.current) return;
    if (Platform.OS !== 'ios' && Platform.OS !== 'android') return;

    if (isAuthenticated && userId) {
      if (lastUserIdRef.current === userId) return;
      lastUserIdRef.current = userId;
      void loginPurchases(userId);
      return;
    }

    if (lastUserIdRef.current) {
      lastUserIdRef.current = null;
      void logoutPurchases();
    }
  }, [hasHydrated, isAuthenticated, userId]);

  return null;
}
