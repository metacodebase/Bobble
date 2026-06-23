import { useEffect, useRef, useState } from 'react';
import { StyleSheet, View } from 'react-native';

import { BobbleColors } from '@/src/theme/colors';

const BAR_COUNT = 48;
const MIN_HEIGHT = 8;
const MAX_HEIGHT = 44;

function meteringToNormalized(metering: number): number {
  const minDb = -50;
  const maxDb = -5;
  const clamped = Math.max(minDb, Math.min(maxDb, metering));
  return (clamped - minDb) / (maxDb - minDb);
}

export function AudioWaveform({
  active = true,
  metering,
}: {
  active?: boolean;
  metering?: number;
}) {
  const [heights, setHeights] = useState(() => Array.from({ length: BAR_COUNT }, () => MIN_HEIGHT));
  const smoothedRef = useRef(0);
  const historyRef = useRef<number[]>(Array.from({ length: BAR_COUNT }, () => 0));

  useEffect(() => {
    if (!active) {
      smoothedRef.current = 0;
      historyRef.current = Array.from({ length: BAR_COUNT }, () => 0);
      setHeights(Array.from({ length: BAR_COUNT }, () => MIN_HEIGHT));
      return;
    }

    if (metering == null) return;

    const normalized = meteringToNormalized(metering);
    smoothedRef.current = smoothedRef.current * 0.55 + normalized * 0.45;

    historyRef.current = [...historyRef.current.slice(1), smoothedRef.current];
    setHeights(
      historyRef.current.map((level) => MIN_HEIGHT + level * (MAX_HEIGHT - MIN_HEIGHT)),
    );
  }, [active, metering]);

  return (
    <View style={styles.root}>
      {heights.map((height, index) => (
        <View
          key={index}
          style={[
            styles.bar,
            {
              height,
              opacity: 0.35 + (index % 5) * 0.12,
            },
          ]}
        />
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 3,
    height: 56,
    paddingHorizontal: 8,
  },
  bar: {
    width: 4,
    borderRadius: 2,
    backgroundColor: BobbleColors.primary,
  },
});
