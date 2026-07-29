import type { ApiError } from '@/src/types/api';

function formatValidationDetails(errors: unknown): string {
  if (!Array.isArray(errors) || errors.length === 0) return '';
  return errors
    .map((item) => {
      if (!item || typeof item !== 'object') return String(item);
      const row = item as { path?: string; message?: string };
      return [row.path, row.message].filter(Boolean).join(': ');
    })
    .filter(Boolean)
    .join('\n');
}

/** Full human-readable API error, including Zod validation paths. */
export function getApiErrorMessage(error: unknown, fallback = 'Something went wrong'): string {
  if (error && typeof error === 'object' && 'message' in error) {
    const apiError = error as ApiError;
    const details = formatValidationDetails(apiError.errors);
    const base = String(apiError.message) || fallback;
    const status = typeof apiError.status === 'number' ? ` [${apiError.status}]` : '';
    return details ? `${base}${status}\n${details}` : `${base}${status}`;
  }
  if (error instanceof Error) return error.message;
  return fallback;
}

/** Always log the raw API failure — useful when toast truncates. */
export function logApiError(label: string, error: unknown): void {
  const message = getApiErrorMessage(error);
  console.error(`[API] ${label}`, message, error);
}

export function getApiErrorCode(error: unknown): string | undefined {
  if (error && typeof error === 'object' && 'code' in error) {
    const code = (error as { code?: unknown }).code;
    return typeof code === 'string' ? code : undefined;
  }
  return undefined;
}

/** Codes that should send the user to the paywall. */
export function isProLimitError(error: unknown): boolean {
  const code = getApiErrorCode(error);
  return (
    code === 'PRO_REQUIRED' ||
    code === 'BOBBLE_LIMIT_REACHED' ||
    code === 'TASK_LIMIT_REACHED'
  );
}
