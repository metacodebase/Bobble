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
  const [isActive, setIsActive] = useState(false);

  const prepare = useCallback(async () => {
    const { granted } = await AudioModule.requestRecordingPermissionsAsync();
    if (!granted) return false;

    await setAudioModeAsync({
      allowsRecording: true,
      playsInSilentMode: true,
    });

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

    (async () => {
      const ready = await prepare();
      if (!ready || cancelled) return;

      audioRecorder.record();
      startedRef.current = true;
      setIsActive(true);
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
    if (!startedRef.current) return null;

    await audioRecorder.stop();
    startedRef.current = false;
    setIsActive(false);
    preparedRef.current = false;

    await releaseAudioSession();

    const rawUri = audioRecorder.uri ?? audioRecorder.getStatus().url ?? null;
    // Copy out of cache before this hook unmounts (which can delete the temp file).
    return persistRecordingUri(rawUri);
  }, [audioRecorder]);

  useEffect(() => {
    return () => {
      if (startedRef.current) {
        void audioRecorder.stop();
        startedRef.current = false;
      }
      void releaseAudioSession();
    };
  }, [audioRecorder]);

  return {
    metering: paused || !isActive ? undefined : recorderState.metering,
    isActive,
    startRecording,
    stopRecording,
  };
}
