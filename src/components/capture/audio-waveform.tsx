import { useEffect, useState } from 'react';
import { StyleSheet, View } from 'react-native';

import { BobbleColors } from '@/src/theme/colors';

const BAR_COUNT = 48;

export function AudioWaveform({ active = true }: { active?: boolean }) {
  const [heights, setHeights] = useState(() => Array.from({ length: BAR_COUNT }, () => 12));

  useEffect(() => {
    if (!active) return;

    const interval = setInterval(() => {
      setHeights(Array.from({ length: BAR_COUNT }, () => 8 + Math.random() * 36));
    }, 120);

    return () => clearInterval(interval);
  }, [active]);

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
