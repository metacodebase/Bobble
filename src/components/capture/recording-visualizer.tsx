import { useEffect } from 'react';
import { StyleSheet, View } from 'react-native';
import Animated, {
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withSequence,
  withTiming,
} from 'react-native-reanimated';
import Svg, { Circle, Defs, RadialGradient, Stop } from 'react-native-svg';

import { BobbleColors } from '@/src/theme/colors';
import { Mic } from 'lucide-react-native';

const GLOW_SIZE = 240;

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
  const breathe = useSharedValue(0);
  const ripple = useSharedValue(0);

  useEffect(() => {
    breathe.value = withRepeat(
      withSequence(
        withTiming(1, { duration: 1800, easing: Easing.inOut(Easing.sin) }),
        withTiming(0, { duration: 1800, easing: Easing.inOut(Easing.sin) }),
      ),
      -1,
      false,
    );
    ripple.value = withRepeat(
      withTiming(1, { duration: 2400, easing: Easing.out(Easing.quad) }),
      -1,
      false,
    );
  }, [breathe, ripple]);

  useEffect(() => {
    if (!active) {
      level.value = withTiming(0, { duration: 400 });
      return;
    }

    if (metering == null) return;

    const target = meteringToLevel(metering);
    level.value = withTiming(target, { duration: 90, easing: Easing.out(Easing.quad) });
  }, [active, metering, level]);

  const outerGlowStyle = useAnimatedStyle(() => {
    const audioScale = 1 + level.value * 0.22 + breathe.value * 0.04;
    const opacity = active ? 0.55 + level.value * 0.35 + breathe.value * 0.08 : 0.35;
    return {
      transform: [{ scale: audioScale }],
      opacity,
    };
  });

  const midGlowStyle = useAnimatedStyle(() => {
    const audioScale = 1 + level.value * 0.14 + breathe.value * 0.03;
    const opacity = active ? 0.65 + level.value * 0.25 : 0.45;
    return {
      transform: [{ scale: audioScale }],
      opacity,
    };
  });

  const innerGlowStyle = useAnimatedStyle(() => {
    const audioScale = 1 + level.value * 0.08;
    return {
      transform: [{ scale: audioScale }],
      opacity: active ? 0.85 + level.value * 0.15 : 0.7,
    };
  });

  const rippleStyle = useAnimatedStyle(() => ({
    transform: [{ scale: 0.72 + ripple.value * 0.55 + level.value * 0.12 }],
    opacity: active ? (1 - ripple.value) * (0.18 + level.value * 0.22) : 0,
  }));

  const micStyle = useAnimatedStyle(() => ({
    transform: [{ scale: 1 + level.value * 0.06 }],
  }));

  return (
    <View style={styles.root}>
      <Animated.View style={[styles.glowLayer, outerGlowStyle]}>
        <Svg width={GLOW_SIZE} height={GLOW_SIZE}>
          <Defs>
            <RadialGradient id="outerGlow" cx="50%" cy="50%" r="50%">
              <Stop offset="0%" stopColor={BobbleColors.primary} stopOpacity={0} />
              <Stop offset="35%" stopColor={BobbleColors.primaryLight} stopOpacity={0.12} />
              <Stop offset="62%" stopColor={BobbleColors.primaryMuted} stopOpacity={0.28} />
              <Stop offset="82%" stopColor={BobbleColors.primary} stopOpacity={0.14} />
              <Stop offset="100%" stopColor={BobbleColors.primary} stopOpacity={0} />
            </RadialGradient>
          </Defs>
          <Circle cx={GLOW_SIZE / 2} cy={GLOW_SIZE / 2} r={GLOW_SIZE / 2} fill="url(#outerGlow)" />
        </Svg>
      </Animated.View>

      <Animated.View style={[styles.glowLayer, midGlowStyle]}>
        <Svg width={GLOW_SIZE * 0.78} height={GLOW_SIZE * 0.78}>
          <Defs>
            <RadialGradient id="midGlow" cx="50%" cy="50%" r="50%">
              <Stop offset="0%" stopColor={BobbleColors.primaryLight} stopOpacity={0.08} />
              <Stop offset="42%" stopColor={BobbleColors.primary} stopOpacity={0.38} />
              <Stop offset="72%" stopColor={BobbleColors.primaryMuted} stopOpacity={0.22} />
              <Stop offset="100%" stopColor={BobbleColors.primaryMuted} stopOpacity={0} />
            </RadialGradient>
          </Defs>
          <Circle
            cx={(GLOW_SIZE * 0.78) / 2}
            cy={(GLOW_SIZE * 0.78) / 2}
            r={(GLOW_SIZE * 0.78) / 2}
            fill="url(#midGlow)"
          />
        </Svg>
      </Animated.View>

      <Animated.View style={[styles.glowLayer, innerGlowStyle]}>
        <Svg width={GLOW_SIZE * 0.52} height={GLOW_SIZE * 0.52}>
          <Defs>
            <RadialGradient id="innerGlow" cx="50%" cy="50%" r="50%">
              <Stop offset="0%" stopColor={BobbleColors.primary} stopOpacity={0.95} />
              <Stop offset="48%" stopColor={BobbleColors.primaryLight} stopOpacity={0.55} />
              <Stop offset="78%" stopColor={BobbleColors.primaryMuted} stopOpacity={0.18} />
              <Stop offset="100%" stopColor={BobbleColors.primaryMuted} stopOpacity={0} />
            </RadialGradient>
          </Defs>
          <Circle
            cx={(GLOW_SIZE * 0.52) / 2}
            cy={(GLOW_SIZE * 0.52) / 2}
            r={(GLOW_SIZE * 0.52) / 2}
            fill="url(#innerGlow)"
          />
        </Svg>
      </Animated.View>

      <Animated.View style={[styles.rippleRing, rippleStyle]} />

      <Animated.View style={[styles.micWrap, micStyle]}>
        <Mic size={36} color="white" strokeWidth={2} />
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    alignItems: 'center',
    justifyContent: 'center',
    height: 260,
  },
  glowLayer: {
    position: 'absolute',
    width: GLOW_SIZE,
    height: GLOW_SIZE,
    alignItems: 'center',
    justifyContent: 'center',
  },
  rippleRing: {
    position: 'absolute',
    width: 120,
    height: 120,
    borderRadius: 60,
    borderWidth: 1.5,
    borderColor: BobbleColors.primaryLight,
  },
  micWrap: {
    width: 72,
    height: 72,
    borderRadius: 36,
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
