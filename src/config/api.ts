import { API_URL, APP_ENV } from '@/src/config/urls';

/**
 * API origin (no trailing slash). Route paths live in `@/src/api/endpoints`.
 * Controlled via `src/config/urls.js` — flip `USE_PROD` for prod vs local.
 */
export function getConfiguredApiUrl(): string {
  return API_URL.replace(/\/$/, '');
}

export function getAppEnv(): string {
  return APP_ENV;
}
