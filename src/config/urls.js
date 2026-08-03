/**
 * API base URLs — flip `USE_PROD` before releasing a production build.
 * Origins only (no trailing slash). Paths like `/api/health` are appended in code.
 *
 * - development → local Node (`npm run dev` in bobble_backend on :8000)
 * - production  → TLS-terminated API origin (nginx proxies to Node :8000)
 *
 * For a physical device hitting your Mac’s LAN backend, temporarily set
 * `URLS.development` to `http://YOUR_MAC_LAN_IP:8000` and keep `USE_PROD = false`.
 */

/** @type {boolean} Set to `true` for release / AWS; `false` for local backend. */
export const USE_PROD = true;

export const URLS = {
  development: 'http://localhost:8000',
  /** Override in EAS with EXPO_PUBLIC_API_URL when using a different API hostname. */
  production: process.env.EXPO_PUBLIC_API_URL || 'http://34.204.180.53',
};

/** Active API origin based on `USE_PROD`. */
export const API_URL = USE_PROD ? URLS.production : URLS.development;

export const APP_ENV = USE_PROD ? 'production' : 'development';
