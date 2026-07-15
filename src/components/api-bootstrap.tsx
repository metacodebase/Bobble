import { useEffect } from 'react';

import { BACKEND_ALLOWED } from '@/src/config/backend';
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

  const health = useHealth(BACKEND_ALLOWED);
  const me = useMe(isAuthenticated && BACKEND_ALLOWED);

  useEffect(() => {
    if (me.data) setUser(me.data);
  }, [me.data, setUser]);

  useEffect(() => {
    if (!BACKEND_ALLOWED || !health.isError || !__DEV__) return;
    const base = getApiBaseUrl() || '(not set)';
    console.warn(
      `[API] Health check failed for ${base}/api/health — check src/config/urls.js (USE_PROD / URLS) or EXPO_PUBLIC_API_URL`
    );
  }, [health.isError]);

  return null;
}
