import { Href, router } from 'expo-router';
import { useEffect, useRef, useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { AudioWaveform } from '@/src/components/capture/audio-waveform';
import { CaptureHeader } from '@/src/components/capture/capture-header';
import { RecordingControls } from '@/src/components/capture/recording-controls';
import { RecordingVisualizer } from '@/src/components/capture/recording-visualizer';
import { useBobbleColors } from '@/src/hooks/use-bobble-colors';
import { useVoiceRecorder } from '@/src/hooks/use-voice-recorder';
import { useCaptureStore } from '@/src/store/capture-store';
import { Typography } from '@/src/theme/fonts';

function formatElapsed(seconds: number) {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
}

export default function RecordScreen() {
  const colors = useBobbleColors();
  const insets = useSafeAreaInsets();
  const [elapsed, setElapsed] = useState(0);
  const [paused, setPaused] = useState(false);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const setRecording = useCaptureStore((state) => state.setRecording);
  const { metering, stopRecording } = useVoiceRecorder(paused);

  useEffect(() => {
    if (paused) {
      if (intervalRef.current) clearInterval(intervalRef.current);
      return;
    }

    intervalRef.current = setInterval(() => {
      setElapsed((prev) => prev + 1);
    }, 1000);

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [paused]);

  const handleStop = async () => {
    const uri = await stopRecording();
    if (uri) {
      setRecording(uri, elapsed);
    }
    router.push('/capture/processing' as Href);
  };

  return (
    <View
      style={[
        styles.root,
        {
          paddingTop: insets.top + 8,
          paddingBottom: insets.bottom + 24,
          backgroundColor: '#F5F2FB',
        },
      ]}
    >
      <CaptureHeader
        title="New Bobble"
        centered
        onBack={() => router.back()}
        titleColor="#17164B"
      />

      <View style={styles.statusBlock}>
        <Text style={[styles.status, { color: colors.primary }]}>
          {paused ? 'Paused' : 'Listening...'}
        </Text>
        <Text style={[styles.timer, { color: '#17164B' }]}>{formatElapsed(elapsed)}</Text>
      </View>

      <View style={styles.visualBlock}>
        <RecordingVisualizer active={!paused} metering={metering} />
        <AudioWaveform active={!paused} metering={metering} />
      </View>

      <RecordingControls
        paused={paused}
        onPause={() => setPaused((prev) => !prev)}
        onStop={handleStop}
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
