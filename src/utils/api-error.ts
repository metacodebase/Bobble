import type { ApiError } from '@/src/types/api';

export function getApiErrorMessage(error: unknown, fallback = 'Something went wrong'): string {
  if (error && typeof error === 'object' && 'message' in error) {
    return String((error as ApiError).message) || fallback;
  }
  if (error instanceof Error) return error.message;
  return fallback;
}
