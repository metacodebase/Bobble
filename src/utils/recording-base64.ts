/** Read a local recording URI into base64 + mime type for the upload API. */
export async function readRecordingAsBase64(
  uri: string,
): Promise<{ audioBase64: string; mimeType: string } | null> {
  try {
    const response = await fetch(uri);
    const blob = await response.blob();
    const mimeType = blob.type || 'audio/m4a';
    const buffer = await blob.arrayBuffer();
    const bytes = new Uint8Array(buffer);
    let binary = '';
    const chunk = 0x8000;
    for (let i = 0; i < bytes.length; i += chunk) {
      binary += String.fromCharCode(...bytes.subarray(i, i + chunk));
    }
    // eslint-disable-next-line no-undef -- btoa is available in RN / Hermes
    const audioBase64 = btoa(binary);
    return { audioBase64, mimeType };
  } catch {
    return null;
  }
}
