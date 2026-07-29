import { useEffect, useRef } from 'react';
import { Platform } from 'react-native';

import {
  configurePurchases,
  loginPurchases,
  logoutPurchases,
} from '@/src/services/purchases';
import { useAppStore } from '@/src/store/app-store';

/**
 * Configures RevenueCat once (preferring known App User ID) and keeps identity
 * synced with auth so purchases never attach to an anonymous RC user.
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

    void (async () => {
      const knownUserId = isAuthenticated && userId ? userId : undefined;
      await configurePurchases(knownUserId);
      if (cancelled) return;

      if (knownUserId) {
        await loginPurchases(knownUserId);
        if (cancelled) return;
        lastUserIdRef.current = knownUserId;
        return;
      }

      if (lastUserIdRef.current) {
        lastUserIdRef.current = null;
        await logoutPurchases();
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [hasHydrated, isAuthenticated, userId]);

  return null;
}
