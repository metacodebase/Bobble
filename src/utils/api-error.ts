import type { ApiError } from '@/src/types/api';

export function getApiErrorMessage(error: unknown, fallback = 'Something went wrong'): string {
  if (error && typeof error === 'object' && 'message' in error) {
    const apiError = error as ApiError;
    const details = Array.isArray(apiError.errors)
      ? apiError.errors
          .map((item) => {
            if (!item || typeof item !== 'object') return String(item);
            const row = item as { path?: string; message?: string };
            return [row.path, row.message].filter(Boolean).join(': ');
          })
          .filter(Boolean)
          .join('; ')
      : '';
    const base = String(apiError.message) || fallback;
    return details ? `${base} (${details})` : base;
  }
  if (error instanceof Error) return error.message;
  return fallback;
}
