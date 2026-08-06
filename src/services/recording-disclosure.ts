import { secureStorage } from '@/src/services/secure-storage';

const RECORDING_DISCLOSURE_KEY = 'recording-processing-disclosure';
const RECORDING_DISCLOSURE_VERSION = '1';

export async function hasAcknowledgedRecordingDisclosure(): Promise<boolean> {
  try {
    return (await secureStorage.getItem(RECORDING_DISCLOSURE_KEY)) === RECORDING_DISCLOSURE_VERSION;
  } catch (error) {
    console.warn('[recording] could not read processing disclosure preference', error);
    return false;
  }
}

export async function acknowledgeRecordingDisclosure(): Promise<void> {
  await secureStorage.setItem(RECORDING_DISCLOSURE_KEY, RECORDING_DISCLOSURE_VERSION);
}
