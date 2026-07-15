/**
 * API base URLs — flip `USE_PROD` before releasing a production build.
 * Origins only (no trailing slash). Paths like `/api/health` are appended in code.
 *
 * - development → local backend (`npm run dev` in bobble_backend)
 * - production  → AWS public API
 *
 * For a physical device hitting your Mac’s LAN backend, temporarily set
 * `URLS.development` to `http://YOUR_MAC_LAN_IP:8000` and keep `USE_PROD = false`.
 */

/** @type {boolean} Set to `true` for release / AWS; `false` for local backend. */
export const USE_PROD = true;

export const URLS = {
  development: 'http://localhost:8000',
  production: 'http://34.204.180.53:8000',
};

/** Active API origin based on `USE_PROD`. */
export const API_URL = USE_PROD ? URLS.production : URLS.development;

export const APP_ENV = USE_PROD ? 'production' : 'development';
