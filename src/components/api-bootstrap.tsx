import { useEffect } from 'react';

import { useHealth, useMe } from '@/src/hooks/api';
import { getApiBaseUrl } from '@/src/services/api';
import { useAppStore } from '@/src/store/app-store';

/**
 * Prefetch session + verify API reachability once at app start.
 * Renders nothing — mount next to navigation root.
 */
export function ApiBootstrap() {
  const isAuthenticated = useAppStore((s) => s.isAuthenticated);
  const setUser = useAppStore((s) => s.setUser);

  const health = useHealth();
  const me = useMe(isAuthenticated);

  useEffect(() => {
    if (me.data) setUser(me.data);
  }, [me.data, setUser]);

  useEffect(() => {
    if (health.isError && __DEV__) {
      const base = getApiBaseUrl() || '(not set)';
      console.warn(
        `[API] Health check failed for ${base}/api/health — set EXPO_PUBLIC_API_URL in .env`
      );
    }
  }, [health.isError]);

  return null;
}
