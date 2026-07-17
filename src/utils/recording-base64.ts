import { Directory, File, Paths } from 'expo-file-system';
import {
  EncodingType,
  cacheDirectory,
  copyAsync,
  documentDirectory,
  getInfoAsync,
  readAsStringAsync,
} from 'expo-file-system/legacy';

export type RecordingPayload = {
  audioBase64: string;
  mimeType: string;
};

function mimeFromUri(uri: string): string {
  const lower = uri.toLowerCase();
  if (lower.endsWith('.m4a') || lower.endsWith('.mp4')) return 'audio/m4a';
  if (lower.endsWith('.mp3')) return 'audio/mpeg';
  if (lower.endsWith('.wav')) return 'audio/wav';
  if (lower.endsWith('.webm')) return 'audio/webm';
  if (lower.endsWith('.aac')) return 'audio/aac';
  if (lower.endsWith('.3gp') || lower.endsWith('.3gpp')) return 'audio/3gpp';
  if (lower.endsWith('.amr')) return 'audio/amr';
  return 'audio/m4a';
}

function fileSize(uri: string): number {
  try {
    const info = new File(uri).info();
    return typeof info.size === 'number' ? info.size : 0;
  } catch {
    return 0;
  }
}

/** Expo-audio on Android can return a zero-byte URI; real file lives under cache/Audio. */
function findLatestCachedAudio(minBytes = 1): string | null {
  try {
    const audioDir = new Directory(Paths.cache, 'Audio');
    if (!audioDir.exists) return null;

    let bestUri: string | null = null;
    let bestScore = -1;

    for (const entry of audioDir.list()) {
      if (!(entry instanceof File) || !entry.exists) continue;
      const info = entry.info();
      const size = typeof info.size === 'number' ? info.size : 0;
      if (size < minBytes) continue;
      const score = (info.modificationTime ?? info.creationTime ?? 0) + size / 1e12;
      if (score > bestScore) {
        bestScore = score;
        bestUri = entry.uri;
      }
    }

    return bestUri;
  } catch {
    return null;
  }
}

async function waitForNonEmptyFile(uri: string, attempts = 8): Promise<boolean> {
  for (let i = 0; i < attempts; i += 1) {
    if (fileSize(uri) > 0) return true;
    const legacy = await getInfoAsync(uri);
    if (legacy.exists && 'size' in legacy && typeof legacy.size === 'number' && legacy.size > 0) {
      return true;
    }
    await new Promise((r) => setTimeout(r, 75));
  }
  return fileSize(uri) > 0;
}

/**
 * Resolve a usable local recording URI after stop().
 * Handles Android zero-byte URI bug and copies into documents so unmounting
 * the recorder cannot delete the temp cache file before upload.
 */
export async function persistRecordingUri(uri: string | null | undefined): Promise<string | null> {
  let candidate = uri?.trim() || null;

  if (candidate) {
    const ready = await waitForNonEmptyFile(candidate);
    if (!ready) {
      candidate = findLatestCachedAudio() ?? candidate;
    }
  } else {
    candidate = findLatestCachedAudio();
  }

  if (!candidate) return null;

  if (!(await waitForNonEmptyFile(candidate)) && fileSize(candidate) <= 0) {
    const fallback = findLatestCachedAudio();
    if (!fallback) return null;
    candidate = fallback;
  }

  const destRoot = documentDirectory ?? cacheDirectory;
  if (!destRoot) return candidate;

  const extMatch = candidate.match(/\.[a-z0-9]+$/i);
  const ext = extMatch?.[0] ?? '.m4a';
  const dest = `${destRoot}bobble-capture-${Date.now()}${ext}`;

  try {
    await copyAsync({ from: candidate, to: dest });
    return (await waitForNonEmptyFile(dest, 4)) ? dest : candidate;
  } catch (error) {
    console.warn('[recording] copy to documents failed, using original URI', error);
    return candidate;
  }
}

async function readBase64(uri: string): Promise<string> {
  try {
    const file = new File(uri);
    if (file.exists) {
      const encoded = await file.base64();
      if (encoded.length > 0) return encoded;
    }
  } catch {
    // fall through to legacy API
  }

  return readAsStringAsync(uri, { encoding: EncodingType.Base64 });
}

/** Read a local recording URI into base64 + mime type for the upload API. */
export async function readRecordingAsBase64(uri: string): Promise<RecordingPayload | null> {
  try {
    const audioBase64 = await readBase64(uri);
    if (!audioBase64) {
      console.warn('[recording] empty base64 for', uri);
      return null;
    }

    return {
      audioBase64,
      mimeType: mimeFromUri(uri),
    };
  } catch (error) {
    console.warn('[recording] failed to read recording as base64', error);
    return null;
  }
}
