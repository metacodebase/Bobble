import { useEffect, useRef, useState } from 'react';
import { StyleSheet, View } from 'react-native';

import { BobbleColors } from '@/src/theme/colors';

const BAR_COUNT = 48;
const MIN_HEIGHT = 3;
const MAX_HEIGHT = 54;

function meteringToNormalized(metering: number): number {
  const minDb = -50;
  const maxDb = -5;
  const clamped = Math.max(minDb, Math.min(maxDb, metering));
  return (clamped - minDb) / (maxDb - minDb);
}

function buildBarHeights(baseLevel: number, tick: number): number[] {
  return Array.from({ length: BAR_COUNT }, (_, index) => {
    const phaseA = Math.sin(index * 0.62 + tick * 0.11);
    const phaseB = Math.cos(index * 0.31 + tick * 0.07);
    const phaseC = Math.sin(index * 1.18 + tick * 0.05) * 0.5;

    const waveMix = Math.abs(phaseA) * 0.45 + Math.abs(phaseB) * 0.35 + Math.abs(phaseC) * 0.2;
    const barGain = 0.12 + waveMix * 0.88;

    const boosted = Math.pow(baseLevel, 0.75);
    const level = Math.min(1, boosted * barGain + (baseLevel > 0.08 ? Math.random() * 0.18 : 0));

    return MIN_HEIGHT + level * (MAX_HEIGHT - MIN_HEIGHT);
  });
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
  const tickRef = useRef(0);

  useEffect(() => {
    if (!active) {
      smoothedRef.current = 0;
      tickRef.current = 0;
      setHeights(Array.from({ length: BAR_COUNT }, () => MIN_HEIGHT));
      return;
    }

    if (metering == null) return;

    const normalized = meteringToNormalized(metering);
    smoothedRef.current = smoothedRef.current * 0.5 + normalized * 0.5;
    tickRef.current += 1;

    setHeights(buildBarHeights(smoothedRef.current, tickRef.current));
  }, [active, metering]);

  return (
    <View style={styles.root}>
      {heights.map((height, index) => {
        const normalizedHeight = (height - MIN_HEIGHT) / (MAX_HEIGHT - MIN_HEIGHT);
        return (
          <View
            key={index}
            style={[
              styles.bar,
              {
                height,
                opacity: 0.28 + normalizedHeight * 0.72,
              },
            ]}
          />
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 3,
    height: 60,
    paddingHorizontal: 8,
  },
  bar: {
    width: 4,
    borderRadius: 2,
    backgroundColor: BobbleColors.primary,
  },
});
