import type { AudioSource } from 'expo-audio';
import { downloadAsync, cacheDirectory, getInfoAsync } from 'expo-file-system/legacy';

import { API } from '@/src/api/endpoints';
import { getConfiguredApiUrl } from '@/src/config/api';

function isInvalidPlaybackUri(uri: string): boolean {
  return uri.startsWith('offline://');
}

function isPublicUploadsUrl(url: string): boolean {
  return /\/uploads\/[^/?#]+$/i.test(url);
}

function isPrivateObjectStorageUrl(url: string): boolean {
  return /\.amazonaws\.com\//i.test(url) || /\/recordings\//i.test(url);
}

async function localFileExists(uri: string): Promise<boolean> {
  try {
    const info = await getInfoAsync(uri);
    return info.exists;
  } catch {
    return false;
  }
}

export function bobbleRecordingApiUrl(bobbleId: string): string {
  return `${getConfiguredApiUrl()}${API.bobbles.recording(bobbleId)}`;
}

async function cacheAuthenticatedRecording(
  bobbleId: string,
  authToken?: string | null,
): Promise<string | null> {
  const headers: Record<string, string> = {
    Accept: 'audio/*',
  };
  if (authToken) {
    headers.Authorization = `Bearer ${authToken}`;
  }

  const destination = `${cacheDirectory}bobble-recording-${bobbleId}.m4a`;
  try {
    const result = await downloadAsync(bobbleRecordingApiUrl(bobbleId), destination, { headers });
    if (result.status < 200 || result.status >= 300) {
      return null;
    }
    return result.uri;
  } catch {
    return null;
  }
}

/** Prefer a local capture file; otherwise play public uploads or stream via the API route. */
export async function resolvePlaybackSource(options: {
  localUri?: string | null;
  remoteAudioUrl?: string | null;
  bobbleId?: string | null;
  authToken?: string | null;
}): Promise<AudioSource | null> {
  const local = options.localUri?.trim();
  if (local && !isInvalidPlaybackUri(local) && (await localFileExists(local))) {
    return local;
  }

  const remote = options.remoteAudioUrl?.trim();
  const bobbleId = options.bobbleId?.trim();

  if (remote && !isInvalidPlaybackUri(remote) && /^https?:\/\//i.test(remote)) {
    if (isPublicUploadsUrl(remote) && !isPrivateObjectStorageUrl(remote)) {
      return remote;
    }

    if (!isPrivateObjectStorageUrl(remote)) {
      return remote;
    }
  }

  if (bobbleId) {
    const cached = await cacheAuthenticatedRecording(bobbleId, options.authToken);
    if (cached) {
      return cached;
    }

    const headers: Record<string, string> = {};
    if (options.authToken) {
      headers.Authorization = `Bearer ${options.authToken}`;
    }

    return {
      uri: bobbleRecordingApiUrl(bobbleId),
      headers,
    };
  }

  if (remote && !isInvalidPlaybackUri(remote) && /^https?:\/\//i.test(remote)) {
    return remote;
  }

  return null;
}
