import { useAppStore } from '@/src/store/app-store';
import type {
  ApiError,
  ApiPaginatedResponse,
  ApiSuccessResponse,
} from '@/src/types/api';

import { getConfiguredApiUrl } from '@/src/config/api';

const BASE_URL = getConfiguredApiUrl();

export function getApiBaseUrl(): string {
  return BASE_URL;
}

type HttpMethod = 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';

interface RequestOptions<TBody = unknown> {
  method?: HttpMethod;
  body?: TBody;
  headers?: Record<string, string>;
  skipAuth?: boolean;
  _retried?: boolean;
}

let refreshInFlight: Promise<string | null> | null = null;

async function refreshAccessToken(): Promise<string | null> {
  const refreshToken = useAppStore.getState().refreshToken;
  if (!refreshToken) return null;

  if (!refreshInFlight) {
    refreshInFlight = fetch(`${BASE_URL}/api/auth/refresh`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ refreshToken }),
    })
      .then(async (res) => {
        const json = (await res.json()) as { data?: { accessToken?: string } };
        if (res.ok && json.data?.accessToken) {
          useAppStore.getState().setAuthToken(json.data.accessToken);
          return json.data.accessToken;
        }
        useAppStore.getState().clearSession();
        return null;
      })
      .catch(() => {
        useAppStore.getState().clearSession();
        return null;
      })
      .finally(() => {
        refreshInFlight = null;
      });
  }

  return refreshInFlight;
}

async function request<TResponse, TBody = unknown>(
  path: string,
  options: RequestOptions<TBody> = {}
): Promise<TResponse> {
  const { method = 'GET', body, headers = {}, skipAuth = false, _retried = false } = options;
  const token = useAppStore.getState().authToken;

  const res = await fetch(`${BASE_URL}${path}`, {
    method,
    headers: {
      'Content-Type': 'application/json',
      ...(!skipAuth && token ? { Authorization: `Bearer ${token}` } : {}),
      ...headers,
    },
    ...(body !== undefined ? { body: JSON.stringify(body) } : {}),
  });

  let json: unknown;
  try {
    json = await res.json();
  } catch {
    json = null;
  }

  if (res.status === 401 && !skipAuth && !_retried) {
    const newToken = await refreshAccessToken();
    if (newToken) {
      return request<TResponse, TBody>(path, { ...options, _retried: true });
    }
  }

  if (!res.ok) {
    const payload = json as { message?: string; code?: string; errors?: unknown[] } | null;
    const error: ApiError = {
      message: payload?.message ?? `Request failed with status ${res.status}`,
      status: res.status,
      code: payload?.code,
      errors: payload?.errors,
    };
    throw error;
  }

  return json as TResponse;
}

export const api = {
  get: <T>(path: string, options?: Omit<RequestOptions, 'method' | 'body'>) =>
    request<ApiSuccessResponse<T>>(path, { method: 'GET', ...options }),

  getPaginated: <T>(path: string, options?: Omit<RequestOptions, 'method' | 'body'>) =>
    request<ApiPaginatedResponse<T>>(path, { method: 'GET', ...options }),

  post: <T, B = unknown>(
    path: string,
    body: B,
    options?: Omit<RequestOptions<B>, 'method' | 'body'>
  ) => request<ApiSuccessResponse<T>, B>(path, { method: 'POST', body, ...options }),

  put: <T, B = unknown>(
    path: string,
    body: B,
    options?: Omit<RequestOptions<B>, 'method' | 'body'>
  ) => request<ApiSuccessResponse<T>, B>(path, { method: 'PUT', body, ...options }),

  patch: <T, B = unknown>(
    path: string,
    body: B,
    options?: Omit<RequestOptions<B>, 'method' | 'body'>
  ) => request<ApiSuccessResponse<T>, B>(path, { method: 'PATCH', body, ...options }),

  delete: <T>(path: string, options?: Omit<RequestOptions, 'method' | 'body'>) =>
    request<ApiSuccessResponse<T>>(path, { method: 'DELETE', ...options }),
};

export function buildQueryString(
  params: Record<string, string | number | boolean | undefined | null>
): string {
  const search = new URLSearchParams();
  for (const [key, value] of Object.entries(params)) {
    if (value === undefined || value === null || value === '') continue;
    search.set(key, String(value));
  }
  const qs = search.toString();
  return qs ? `?${qs}` : '';
}

export function unwrap<T>(response: ApiSuccessResponse<T>): T {
  return response.data;
}

export function unwrapPaginated<T>(response: ApiPaginatedResponse<T>) {
  return { data: response.data, pagination: response.pagination };
}
