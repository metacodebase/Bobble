import { Image } from 'expo-image';
import {
  Check,
  Dumbbell,
  Folder,
  Leaf,
  List,
  LucideIcon,
  Music2,
} from 'lucide-react-native';
import { useEffect } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import {
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withTiming,
} from 'react-native-reanimated';

import { BobbleColors } from '@/src/theme';
import { Typography } from '@/src/theme/fonts';

const SAVE_TEXT = '#17164B';
const SAVING_MASCOT = require('@/src/assets/images/bobble-saving.png');
const MIN_PROGRESS = 0.08;

type OrbitItem = {
  Icon: LucideIcon;
  backgroundColor: string;
  color: string;
  angle: number;
};

const ORBIT_ITEMS: OrbitItem[] = [
  { Icon: Music2, backgroundColor: '#EDE9FE', color: '#9F52F2', angle: 0 },
  { Icon: Check, backgroundColor: '#DBEAFE', color: '#3B82F6', angle: 60 },
  { Icon: List, backgroundColor: '#FCE7F3', color: '#EC4899', angle: 120 },
  { Icon: Leaf, backgroundColor: '#DCFCE7', color: '#16A34A', angle: 180 },
  { Icon: Folder, backgroundColor: '#FEF9C3', color: '#CA8A04', angle: 240 },
  { Icon: Dumbbell, backgroundColor: '#EDE9FE', color: '#7C3AED', angle: 300 },
];

const ORBIT_RADIUS = 118;

type BobbleSaveLoadingProps = {
  progress: number;
};

function OrbitIcon({ item }: { item: OrbitItem }) {
  const radians = (item.angle * Math.PI) / 180;
  const x = Math.cos(radians) * ORBIT_RADIUS;
  const y = Math.sin(radians) * ORBIT_RADIUS;
  const Icon = item.Icon;

  return (
    <View
      style={[
        styles.orbitIcon,
        {
          transform: [{ translateX: x }, { translateY: y }],
          backgroundColor: item.backgroundColor,
        },
      ]}
    >
      <Icon size={18} color={item.color} strokeWidth={2.2} />
    </View>
  );
}

export function BobbleSaveLoading({ progress }: BobbleSaveLoadingProps) {
  const rotation = useSharedValue(0);

  useEffect(() => {
    rotation.value = withRepeat(
      withTiming(360, { duration: 12000, easing: Easing.linear }),
      -1,
      false,
    );
  }, [rotation]);

  const orbitStyle = useAnimatedStyle(() => ({
    transform: [{ rotate: `${rotation.value}deg` }],
  }));

  const clampedProgress = Math.max(MIN_PROGRESS, Math.min(progress, 1));

  return (
    <View style={styles.root}>
      <View style={styles.hero}>
        <Text style={styles.title}>Saving your Bobble...</Text>
        <Text style={styles.subtitle}>Organising your thoughts beautifully ✨</Text>
      </View>

      <View style={styles.visual}>
        <Image source={SAVING_MASCOT} style={styles.mascot} contentFit="contain" />
      </View>

      <View style={styles.footer}>
        <Text style={styles.footerText}>Almost done...</Text>

      </View>
      <View style={styles.track}>
        <View style={[styles.fill, { width: `${clampedProgress * 100}%` }]} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    justifyContent: 'space-evenly',
    paddingTop: 24,
    paddingBottom: 8,
    gap: 20
  },
  hero: {
    alignItems: 'center',
    gap: 8,
    paddingHorizontal: 12,
  },
  title: {
    ...Typography.heading,
    fontSize: 28,
    lineHeight: 36,
    color: SAVE_TEXT,
    textAlign: 'center',
  },
  subtitle: {
    ...Typography.body,
    fontSize: 16,
    lineHeight: 24,
    color: BobbleColors.textSecondary,
    textAlign: 'center',
  },
  visual: {
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 380,
  },
  orbitRing: {
    position: 'absolute',
    width: ORBIT_RADIUS * 2 + 56,
    height: ORBIT_RADIUS * 2 + 56,
    borderRadius: ORBIT_RADIUS + 28,
    borderWidth: 1,
    borderColor: 'rgba(159, 82, 242, 0.12)',
  },
  orbitLayer: {
    position: 'absolute',
    width: 0,
    height: 0,
    alignItems: 'center',
    justifyContent: 'center',
  },
  orbitIcon: {
    position: 'absolute',
    width: 40,
    height: 40,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#9F52F2',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 2,
  },
  mascot: {
    width: 380,
    height: 262,
    backgroundColor: 'transparent',
  },
  footer: {
    gap: 12,
    paddingHorizontal: 8,
  },
  footerText: {
    ...Typography.body,
    lineHeight: 22,
    textAlign: 'center',
    color: BobbleColors.text
  },
  track: {
    height: 8,
    borderRadius: 4,
    overflow: 'hidden',
    width: '95%',
    alignSelf: 'center',
    backgroundColor: 'rgba(159, 82, 242, 0.18)',
  },
  fill: {
    height: '100%',
    borderRadius: 4,
    backgroundColor: '#9F52F2',
  },
});
