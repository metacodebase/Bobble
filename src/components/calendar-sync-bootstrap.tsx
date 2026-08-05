import { useEffect, useRef } from 'react';
import { AppState } from 'react-native';

import { resyncAllTasksToCalendar, validateCalendarConnection } from '@/src/services/calendar-sync';
import { useAppStore } from '@/src/store/app-store';

const MIN_RECONCILE_INTERVAL_MS = 30_000;

/** Repairs calendar writes missed while the app was backgrounded or interrupted. */
export function CalendarSyncBootstrap() {
  const hasHydrated = useAppStore((s) => s.hasHydrated);
  const isAuthenticated = useAppStore((s) => s.isAuthenticated);
  const isGuest = useAppStore((s) => s.isGuest);
  const userId = useAppStore((s) => s.user?._id ?? null);
  const syncCalendarId = useAppStore((s) => s.syncCalendarId);
  const lastRunAtRef = useRef(0);
  const initializedSessionRef = useRef<string | null>(null);
  const runningRef = useRef(false);

  useEffect(() => {
    const sessionKey = isAuthenticated && userId ? userId : isGuest ? 'guest' : null;
    if (!hasHydrated) return;
    if (!sessionKey) {
      initializedSessionRef.current = null;
      return;
    }
    if (!syncCalendarId) return;

    const reconcile = async (force = false) => {
      const now = Date.now();
      if (runningRef.current) return;
      if (!force && now - lastRunAtRef.current < MIN_RECONCILE_INTERVAL_MS) return;

      runningRef.current = true;
      lastRunAtRef.current = now;
      try {
        const connection = await validateCalendarConnection();
        if (connection !== 'ready') {
          if (__DEV__) {
            console.warn('[calendar-sync] automatic reconciliation skipped', connection);
          }
          return;
        }
        const result = await resyncAllTasksToCalendar();
        if (__DEV__ && result.failed > 0) {
          console.warn('[calendar-sync] automatic reconciliation incomplete', result);
        }
      } catch (error) {
        if (__DEV__) console.warn('[calendar-sync] automatic reconciliation failed', error);
      } finally {
        runningRef.current = false;
      }
    };

    if (initializedSessionRef.current !== sessionKey) {
      initializedSessionRef.current = sessionKey;
      void reconcile(true);
    }

    const subscription = AppState.addEventListener('change', (state) => {
      if (state === 'active') void reconcile();
    });
    return () => subscription.remove();
  }, [hasHydrated, isAuthenticated, isGuest, userId, syncCalendarId]);

  return null;
}
