import { FontAwesome } from '@expo/vector-icons';
import { useEffect } from 'react';
import { StyleSheet, View } from 'react-native';
import Animated, {
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';

import { BobbleColors } from '@/src/theme/colors';

function meteringToLevel(metering: number): number {
  const minDb = -50;
  const maxDb = -5;
  const clamped = Math.max(minDb, Math.min(maxDb, metering));
  return (clamped - minDb) / (maxDb - minDb);
}

type RecordingVisualizerProps = {
  active?: boolean;
  metering?: number;
};

export function RecordingVisualizer({ active = true, metering }: RecordingVisualizerProps) {
  const level = useSharedValue(0);

  useEffect(() => {
    if (!active) {
      level.value = withTiming(0, { duration: 400 });
      return;
    }

    if (metering == null) return;

    const target = meteringToLevel(metering);
    level.value = withTiming(target, { duration: 90, easing: Easing.out(Easing.quad) });
  }, [active, metering, level]);

  const micStyle = useAnimatedStyle(() => ({
    transform: [{ scale: 1 + level.value * 0.06 }],
  }));

  const ringStyle = useAnimatedStyle(() => ({
    transform: [{ scale: 1 + level.value * 0.03 }],
  }));

  return (
    <View style={styles.root}>
      <Animated.View style={[styles.ringOuter, ringStyle]} />
      <Animated.View style={[styles.ringInner, ringStyle]} />
      <Animated.View style={[styles.micWrap, micStyle]}>
        <FontAwesome name="microphone" size={36} color={BobbleColors.textOnPrimary} />
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    alignItems: 'center',
    justifyContent: 'center',
    height: 320,
  },
  ringOuter: {
    position: 'absolute',
    width: 220,
    height: 220,
    borderRadius: 110,
    backgroundColor: '#ECE6F6',
  },
  ringInner: {
    position: 'absolute',
    width: 172,
    height: 172,
    borderRadius: 86,
    backgroundColor: '#E2D5F5',
  },
  micWrap: {
    width: 96,
    height: 96,
    borderRadius: 48,
    backgroundColor: BobbleColors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: BobbleColors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 16,
    elevation: 6,
  },
});
