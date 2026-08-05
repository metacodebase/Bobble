import {
  AudioModule,
  RecordingPresets,
  setAudioModeAsync,
  useAudioRecorder,
  useAudioRecorderState,
} from 'expo-audio';
import { useCallback, useEffect, useRef, useState } from 'react';

import { persistRecordingUri } from '@/src/utils/recording-base64';

/** AAC/m4a on both platforms — better for AssemblyAI than LOW_QUALITY (.3gp/amr on Android). */
const RECORDING_OPTIONS = {
  ...RecordingPresets.HIGH_QUALITY,
  isMeteringEnabled: true,
};

type UseVoiceRecorderOptions = {
  autoStart?: boolean;
};

async function releaseAudioSession() {
  await setAudioModeAsync({
    allowsRecording: false,
    playsInSilentMode: true,
  });
}

export function useVoiceRecorder(paused: boolean, options: UseVoiceRecorderOptions = {}) {
  const { autoStart = true } = options;
  const audioRecorder = useAudioRecorder(RECORDING_OPTIONS);
  const recorderState = useAudioRecorderState(audioRecorder, 50);
  const startedRef = useRef(false);
  const preparedRef = useRef(false);
  const mountedRef = useRef(true);
  const stopPromiseRef = useRef<Promise<string | null> | null>(null);
  const [isActive, setIsActive] = useState(false);

  const prepare = useCallback(async () => {
    const { granted } = await AudioModule.requestRecordingPermissionsAsync();
    if (!granted || !mountedRef.current) return false;

    await setAudioModeAsync({
      allowsRecording: true,
      playsInSilentMode: true,
    });
    if (!mountedRef.current) return false;

    if (!preparedRef.current) {
      await audioRecorder.prepareToRecordAsync();
      preparedRef.current = true;
    }

    return true;
  }, [audioRecorder]);

  const startRecording = useCallback(async () => {
    const ready = await prepare();
    if (!ready) return false;

    audioRecorder.record();
    startedRef.current = true;
    setIsActive(true);
    return true;
  }, [audioRecorder, prepare]);

  useEffect(() => {
    if (!autoStart) return;

    let cancelled = false;

    void (async () => {
      try {
        const ready = await prepare();
        if (!ready || cancelled || !mountedRef.current) return;

        audioRecorder.record();
        startedRef.current = true;
        setIsActive(true);
      } catch (error) {
        if (!cancelled && mountedRef.current) {
          console.warn('[recording] auto-start failed', error);
        }
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [autoStart, audioRecorder, prepare]);

  useEffect(() => {
    if (!startedRef.current) return;

    if (paused) {
      audioRecorder.pause();
      return;
    }

    if (recorderState.canRecord && !recorderState.isRecording) {
      audioRecorder.record();
    }
  }, [paused, audioRecorder, recorderState.canRecord, recorderState.isRecording]);

  const stopRecording = useCallback(async () => {
    if (stopPromiseRef.current) return stopPromiseRef.current;
    if (!startedRef.current) return null;

    // Claim the recorder before awaiting so navigation cleanup and button taps
    // cannot issue a second native stop against the same SharedObject.
    startedRef.current = false;
    setIsActive(false);
    const stopPromise = (async () => {
      try {
        await audioRecorder.stop();
        preparedRef.current = false;

        // Copy out of cache before this hook unmounts (which can delete the temp file).
        return await persistRecordingUri(audioRecorder.uri);
      } finally {
        await releaseAudioSession().catch((error) => {
          console.warn('[recording] audio session cleanup failed', error);
        });
      }
    })();
    stopPromiseRef.current = stopPromise;

    try {
      return await stopPromise;
    } finally {
      if (stopPromiseRef.current === stopPromise) stopPromiseRef.current = null;
    }
  }, [audioRecorder]);

  useEffect(() => {
    mountedRef.current = true;
    return () => {
      mountedRef.current = false;
      startedRef.current = false;
      // useAudioRecorder owns and releases its SharedObject on unmount. Calling
      // recorder.stop() here races that release and causes the native cast error.
      void releaseAudioSession().catch(() => undefined);
    };
  }, []);

  return {
    metering: paused || !isActive ? undefined : recorderState.metering,
    isActive,
    startRecording,
    stopRecording,
  };
}
