import type { ImageSource } from 'expo-image';

import { API } from '@/src/api/endpoints';
import { getConfiguredApiUrl } from '@/src/config/api';

/** Only http(s) URLs are loadable by the image component — ignore base64 blobs in persisted state. */
export function resolveAvatarUrl(
  ...candidates: Array<string | null | undefined>
): string | undefined {
  for (const candidate of candidates) {
    const value = candidate?.trim();
    if (value && /^https?:\/\//i.test(value)) {
      return value;
    }
  }
  return undefined;
}

/** Prefer the authenticated API proxy — direct S3 URLs often fail silently in expo-image. */
export function toAvatarLoadUrl(url?: string): string | undefined {
  const resolved = resolveAvatarUrl(url);
  if (!resolved) return undefined;

  if (resolved.includes('/api/profile/avatar')) {
    return resolved;
  }

  return `${getConfiguredApiUrl()}${API.profile.avatar}`;
}

export function buildAvatarImageSource(
  url: string | undefined,
  authToken: string | null | undefined,
  cacheKey = 0,
): ImageSource | undefined {
  const loadUrl = toAvatarLoadUrl(url);
  if (!loadUrl) return undefined;

  const uri =
    cacheKey > 0
      ? `${loadUrl}${loadUrl.includes('?') ? '&' : '?'}v=${cacheKey}`
      : loadUrl;

  if (uri.includes('/api/profile/avatar') && authToken) {
    return {
      uri,
      headers: { Authorization: `Bearer ${authToken}` },
    };
  }

  return { uri };
}

export function isLocalAvatarUri(uri?: string): boolean {
  return Boolean(uri?.startsWith('file://') || uri?.startsWith('content://'));
}

export function avatarUrlNeedsAuth(url?: string): boolean {
  return Boolean(url?.includes('/api/profile/avatar'));
}
