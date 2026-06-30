import {
  AudioModule,
  RecordingPresets,
  setAudioModeAsync,
  useAudioRecorder,
  useAudioRecorderState,
} from 'expo-audio';
import { useCallback, useEffect, useRef } from 'react';

const RECORDING_OPTIONS = {
  ...RecordingPresets.LOW_QUALITY,
  isMeteringEnabled: true,
};

export function useVoiceRecorder(paused: boolean) {
  const audioRecorder = useAudioRecorder(RECORDING_OPTIONS);
  const recorderState = useAudioRecorderState(audioRecorder, 50);
  const startedRef = useRef(false);

  useEffect(() => {
    let cancelled = false;

    (async () => {
      const { granted } = await AudioModule.requestRecordingPermissionsAsync();
      if (!granted || cancelled) return;

      await setAudioModeAsync({
        allowsRecording: true,
        playsInSilentMode: true,
      });

      await audioRecorder.prepareToRecordAsync();
      if (cancelled) return;

      audioRecorder.record();
      startedRef.current = true;
    })();

    return () => {
      cancelled = true;
      if (startedRef.current) {
        void audioRecorder.stop();
        startedRef.current = false;
      }
    };
  }, [audioRecorder]);

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
    return audioRecorder.uri;
  }, [audioRecorder]);

  return {
    metering: paused ? undefined : recorderState.metering,
    stopRecording,
  };
}
