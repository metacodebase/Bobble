/**
 * API origin (no trailing slash). Route paths live in `@/src/api/endpoints`.
 */
export function getConfiguredApiUrl(): string {
  return process.env.EXPO_PUBLIC_API_URL ?? '';
}

export function getAppEnv(): string {
  return process.env.EXPO_PUBLIC_APP_ENV ?? 'development';
}
