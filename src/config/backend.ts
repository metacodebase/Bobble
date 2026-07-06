/**
 * When `false`, the app runs in UI-only demo mode — no network requests to the API.
 * Flip to `true` once the backend is ready.
 */
export const BACKEND_ALLOWED = false;

export const isDemoMode = !BACKEND_ALLOWED;
