import { useFocusEffect } from '@react-navigation/native';
import { Href, router } from 'expo-router';
import { useCallback, useEffect, useRef, useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { AudioWaveform } from '@/src/components/capture/audio-waveform';
import { CaptureHeader } from '@/src/components/capture/capture-header';
import { RecordingControls } from '@/src/components/capture/recording-controls';
import { RecordingVisualizer } from '@/src/components/capture/recording-visualizer';
import { useBobbleColors } from '@/src/hooks/use-bobble-colors';
import { useNightForeground } from '@/src/hooks/use-night-foreground';
import { useVoiceRecorder } from '@/src/hooks/use-voice-recorder';
import { CAPTURE_COPY, useCaptureStore } from '@/src/store/capture-store';
import { Typography } from '@/src/theme/fonts';

function formatElapsed(seconds: number) {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
}

export default function RecordScreen() {
  const colors = useBobbleColors();
  const night = useNightForeground();
  const insets = useSafeAreaInsets();
  const [elapsed, setElapsed] = useState(0);
  const [paused, setPaused] = useState(false);
  const [autoStart, setAutoStart] = useState(() => !useCaptureStore.getState().recordingUri);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const elapsedRef = useRef(0);
  const captureKind = useCaptureStore((state) => state.captureKind);
  const recordingUri = useCaptureStore((state) => state.recordingUri);
  const setRecording = useCaptureStore((state) => state.setRecording);
  const { metering, isActive, startRecording, stopRecording } = useVoiceRecorder(paused, {
    autoStart,
  });
  const isActiveRef = useRef(isActive);
  const stopRecordingRef = useRef(stopRecording);
  const setRecordingRef = useRef(setRecording);
  const copy = CAPTURE_COPY[captureKind];

  const canContinue = Boolean(recordingUri) && !isActive;

  useEffect(() => {
    isActiveRef.current = isActive;
  }, [isActive]);

  useEffect(() => {
    stopRecordingRef.current = stopRecording;
  }, [stopRecording]);

  useEffect(() => {
    setRecordingRef.current = setRecording;
  }, [setRecording]);

  useEffect(() => {
    elapsedRef.current = elapsed;
  }, [elapsed]);

  useFocusEffect(
    useCallback(() => {
      const { recordingUri: savedUri, recordingDurationSeconds } = useCaptureStore.getState();

      if (savedUri) {
        setElapsed(recordingDurationSeconds);
        setAutoStart(false);
      } else {
        setElapsed(0);
        setAutoStart(true);
      }
      setPaused(false);

      return () => {
        void (async () => {
          if (!isActiveRef.current) return;

          const uri = await stopRecordingRef.current();
          setRecordingRef.current(uri ?? '', Math.max(elapsedRef.current, 1));
        })();
      };
    }, []),
  );

  useEffect(() => {
    if (paused || !isActive) {
      if (intervalRef.current) clearInterval(intervalRef.current);
      return;
    }

    intervalRef.current = setInterval(() => {
      setElapsed((prev) => prev + 1);
    }, 1000);

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [paused, isActive]);

  const handleStop = async () => {
    if (!isActive) {
      await startRecording();
      return;
    }

    const uri = await stopRecording();
    setRecording(uri ?? '', Math.max(elapsed, 1));
    router.push('/capture/processing' as Href);
  };

  return (
    <View
      style={[
        styles.root,
        {
          paddingTop: insets.top + 8,
          paddingBottom: insets.bottom + 24,
        },
      ]}
    >
      <CaptureHeader
        title={copy.title}
        centered
        onBack={() => router.back()}
      />

      <View style={styles.statusBlock}>
        <Text style={[styles.status, { color: colors.primary }]}>
          {!isActive && canContinue
            ? 'Paused'
            : paused
              ? 'Paused'
              : copy.listening}
        </Text>
        <Text style={[styles.timer, { color: night.text ?? colors.text }]}>{formatElapsed(elapsed)}</Text>
      </View>

      <View style={styles.visualBlock}>
        <RecordingVisualizer active={isActive && !paused} metering={metering} />
        <AudioWaveform active={isActive && !paused} metering={metering} />
      </View>

      <RecordingControls
        paused={paused}
        onPause={() => setPaused((prev) => !prev)}
        onStop={handleStop}
        stopLabel={canContinue ? 'Continue recording' : 'Stop'}
        pauseDisabled={!isActive}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    paddingHorizontal: 32,
  },
  statusBlock: {
    alignItems: 'center',
    marginTop: 20,
    marginBottom: 10,
    gap: 10,
  },
  status: {
    ...Typography.caption,
    fontSize: 25,
    lineHeight: 40,
  },
  timer: {
    fontFamily: Typography.heading.fontFamily,
    fontSize: 50,
    lineHeight: 68,
    fontVariant: ['tabular-nums'],
  },
  visualBlock: {
    flex: 1,
    justifyContent: 'space-evenly',
    paddingTop: 6,
    paddingBottom: 22,
  },
});
