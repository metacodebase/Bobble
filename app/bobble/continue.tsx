import { Href, router, useLocalSearchParams } from 'expo-router';
import { useEffect, useRef, useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Settings } from 'lucide-react-native';

import { AudioWaveform } from '@/src/components/capture/audio-waveform';
import { CaptureHeader } from '@/src/components/capture/capture-header';
import { RecordingControls } from '@/src/components/capture/recording-controls';
import { RecordingVisualizer } from '@/src/components/capture/recording-visualizer';
import { BobbleColors } from '@/src/theme/colors';
import { Typography } from '@/src/theme/fonts';

function formatElapsed(seconds: number) {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
}

export default function ContinueBobbleScreen() {
  const insets = useSafeAreaInsets();
  const { id } = useLocalSearchParams<{ id?: string }>();
  const [elapsed, setElapsed] = useState(0);
  const [paused, setPaused] = useState(false);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

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

  const handleStop = () => {
    router.replace({ pathname: '/bobble/updated', params: { id: id ?? '1' } } as Href);
  };

  return (
    <View style={[styles.root, { paddingTop: insets.top + 8, paddingBottom: insets.bottom + 24 }]}>
      <CaptureHeader
        title="Continue Bobbling"
        onBack={() => router.back()}
        rightIcon={Settings}
      />

      <View style={styles.statusBlock}>
        <Text style={styles.status}>{paused ? 'Paused' : 'Recording...'}</Text>
        <Text style={styles.timer}>{formatElapsed(elapsed)}</Text>
      </View>

      <View style={styles.visualBlock}>
        <RecordingVisualizer />
        <AudioWaveform active={!paused} />
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
    backgroundColor: BobbleColors.background,
    paddingHorizontal: 24,
  },
  statusBlock: {
    alignItems: 'center',
    marginTop: 12,
    marginBottom: 8,
    gap: 8,
  },
  status: {
    ...Typography.caption,
    color: BobbleColors.textSecondary,
  },
  timer: {
    fontFamily: Typography.heading.fontFamily,
    fontSize: 48,
    lineHeight: 56,
    color: BobbleColors.text,
    fontVariant: ['tabular-nums'],
  },
  visualBlock: {
    flex: 1,
    justifyContent: 'center',
    gap: 24,
  },
});
