import type { AudioSource } from 'expo-audio';
import { getInfoAsync } from 'expo-file-system/legacy';

import { API } from '@/src/api/endpoints';
import { getConfiguredApiUrl } from '@/src/config/api';

function isInvalidPlaybackUri(uri: string): boolean {
  return uri.startsWith('offline://');
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

/** Prefer a local capture file; otherwise stream from the authenticated API route. */
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

  // S3 recordings are private — always stream through the authenticated API route.
  if (bobbleId && remote && !isInvalidPlaybackUri(remote)) {
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
