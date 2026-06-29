import { useEffect } from 'react';
import { StyleSheet, View } from 'react-native';
import Animated, {
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withDelay,
  withRepeat,
  withSequence,
  withTiming,
} from 'react-native-reanimated';

import { useBobbleColors } from '@/src/hooks/use-bobble-colors';

/** Tuned to bobble-main.png sphere at 160×160 */
export const MASCOT_THOUGHT_ANCHOR = {
  top: 15,
  right: 0,
} as const;

const BADGE_WIDTH = 44;
const BADGE_HEIGHT = 48;
const MASK_SIZE = 28;
const ORBIT_RX = 14;
const ORBIT_RY = 5;
const ELECTRON_SIZE = 4;
const DOT_SIZE = 4;
const DOT_GAP = 3;

type OrbitProps = {
  tilt: string;
  phaseOffset: number;
  duration: number;
  trackColor: string;
  electronColor: string;
};

function Orbit({ tilt, phaseOffset, duration, trackColor, electronColor }: OrbitProps) {
  const angle = useSharedValue(phaseOffset);

  useEffect(() => {
    angle.value = withRepeat(
      withTiming(phaseOffset + 360, { duration, easing: Easing.linear }),
      -1,
      false,
    );
  }, [angle, duration, phaseOffset]);

  const electronStyle = useAnimatedStyle(() => {
    const rad = (angle.value * Math.PI) / 180;
    return {
      transform: [
        { translateX: Math.cos(rad) * ORBIT_RX },
        { translateY: Math.sin(rad) * ORBIT_RY },
      ],
    };
  });

  return (
    <View style={[styles.orbit, { transform: [{ rotate: tilt }] }]}>
      <View style={[styles.orbitTrack, { borderColor: trackColor }]} />
      <Animated.View
        style={[styles.electron, { backgroundColor: electronColor }, electronStyle]}
      />
    </View>
  );
}

function ThinkingDot({ delay, color }: { delay: number; color: string }) {
  const offset = useSharedValue(0);

  useEffect(() => {
    offset.value = withRepeat(
      withSequence(
        withDelay(delay, withTiming(-3, { duration: 280, easing: Easing.out(Easing.quad) })),
        withTiming(0, { duration: 280, easing: Easing.in(Easing.quad) }),
        withDelay(560, withTiming(0, { duration: 0 })),
      ),
      -1,
      false,
    );
  }, [delay, offset]);

  const dotStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: offset.value }],
  }));

  return (
    <Animated.View style={[styles.thinkingDot, { backgroundColor: color }, dotStyle]} />
  );
}

function ThinkingDots({ color }: { color: string }) {
  return (
    <View style={styles.thinkingDots}>
      <ThinkingDot delay={0} color={color} />
      <ThinkingDot delay={160} color={color} />
      <ThinkingDot delay={320} color={color} />
    </View>
  );
}

type ProcessingAtomBadgeProps = {
  backgroundColor: string;
};

export function ProcessingAtomBadge({ backgroundColor }: ProcessingAtomBadgeProps) {
  const colors = useBobbleColors();
  const dotCenterX = BADGE_WIDTH - 2 - MASK_SIZE / 2;
  const dotCenterY = MASK_SIZE / 2;

  return (
    <View style={styles.root}>
      {/* <View
        style={[styles.mask, { backgroundColor, width: MASK_SIZE, height: MASK_SIZE }]}
        pointerEvents="none"
      /> */}

      {/* <View
        style={[
          styles.atomLayer,
          {
            width: ORBIT_RX * 2 + 8,
            height: ORBIT_RY * 2 + 8,
            left: dotCenterX - ORBIT_RX - 4,
            top: dotCenterY - ORBIT_RY - 4,
          },
        ]}
        pointerEvents="none"
      >
        <Orbit
          tilt="0deg"
          phaseOffset={0}
          duration={2200}
          trackColor={`${colors.primary}50`}
          electronColor={colors.primary}
        />
        <Orbit
          tilt="65deg"
          phaseOffset={120}
          duration={2800}
          trackColor={`${colors.primaryLight}40`}
          electronColor={colors.primaryLight}
        />
        <Orbit
          tilt="-65deg"
          phaseOffset={240}
          duration={3200}
          trackColor={`${colors.primaryMuted}35`}
          electronColor={colors.primaryMuted}
        />
      </View> */}

      {/* <View
        style={[
          styles.connector,
          { backgroundColor: `${colors.primary}80`, left: dotCenterX - 2, top: MASK_SIZE - 2 },
        ]}
        pointerEvents="none"
      /> */}

      <View
        style={[
          styles.thinkingBubble,
          {
            backgroundColor: colors.surface,
            borderColor: `${colors.primary}50`,
            left: dotCenterX - 28,
            width:'100%',
            height:30,
            top: 0,
          },
        ]}
        pointerEvents="none"
      >
        <ThinkingDots color={colors.primary} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    width: BADGE_WIDTH,
    height: BADGE_HEIGHT,
  },
  mask: {
    position: 'absolute',
    top: 0,
    right: 2,
    borderRadius: MASK_SIZE / 2,
    zIndex: 1,
  },
  atomLayer: {
    position: 'absolute',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 2,
  },
  orbit: {
    ...StyleSheet.absoluteFillObject,
    alignItems: 'center',
    justifyContent: 'center',
  },
  orbitTrack: {
    position: 'absolute',
    width: ORBIT_RX * 2,
    height: ORBIT_RY * 2,
    borderRadius: ORBIT_RX,
    borderWidth: 1,
  },
  electron: {
    position: 'absolute',
    width: ELECTRON_SIZE,
    height: ELECTRON_SIZE,
    borderRadius: ELECTRON_SIZE / 2,
  },
  connector: {
    position: 'absolute',
    width: 4,
    height: 4,
    borderRadius: 2,
    zIndex: 2,
  },
  thinkingBubble: {
    position: 'absolute',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 7,
    paddingVertical: 4,
    borderRadius: 9,
    borderWidth: 1,
    zIndex: 3,
  },
  thinkingDots: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    gap: DOT_GAP,
    height: DOT_SIZE + 3,
  },
  thinkingDot: {
    width: DOT_SIZE,
    height: DOT_SIZE,
    borderRadius: DOT_SIZE / 2,
  },
});
