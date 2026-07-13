import { Image } from 'expo-image';
import { LinearGradient } from 'expo-linear-gradient';
import { ImageSourcePropType, Platform, StyleSheet, Text, View } from 'react-native';

import { BobbleColors } from '@/src/theme/colors';
import { Typography } from '@/src/theme/fonts';

const SOUND_MASCOT = require('@/src/assets/images/bobble-sound.png');
const WRITING_MASCOT = require('@/src/assets/images/bobble-writing.png');
const HAMMER_MASCOT = require('@/src/assets/images/bobble-hammer.png');
const NERD_MASCOT = require('@/src/assets/images/bobble-nerd.png');
const GREET_MASCOT = require('@/src/assets/images/mascot/bobble-greet.png');

export function isNerdyProgressState(completed: number, total: number): boolean {
  return total > 0 && completed === total - 1;
}

function getProgressMascot(completed: number, total: number): ImageSourcePropType {
  if (total <= 0) return SOUND_MASCOT;
  if (completed >= total) return GREET_MASCOT;
  if (isNerdyProgressState(completed, total)) return NERD_MASCOT;
  if (completed > 0) return HAMMER_MASCOT;
  return WRITING_MASCOT;
}

function renderSubtitle(subtitle: string) {
  const parts = subtitle.split(/(Bobble)/g);
  return parts.map((part, index) =>
    part === 'Bobble' ? (
      <Text key={index} style={{ color: BobbleColors.primary }}>
        {part}
      </Text>
    ) : (
      part
    ),
  );
}

type TodayProgressCardProps = {
  completed?: number;
  total?: number;
  subtitle?: string;
};

export function TodayProgressCard({
  completed = 0,
  total = 0,
  subtitle = 'Your day is just beginning, record your first Bobble.',
}: TodayProgressCardProps) {
  const progress = total > 0 ? Math.min(completed / total, 1) : 0;
  const mascot = getProgressMascot(completed, total);

  return (
    <LinearGradient
      colors={[BobbleColors.primary, BobbleColors.primaryLight, '#D8B4FE']}
      start={{ x: 0.5, y: 0 }}
      end={{ x: 0.7, y: 1 }}
      style={styles.card}
    >
      <View style={styles.top}>
        <Text style={[styles.title, { color: BobbleColors.textOnPrimary }]}>Today's Progress</Text>
        <View style={styles.body}>
          <View style={styles.countWrap}>
            <Text style={[styles.count, { color: BobbleColors.textOnPrimary }]}>
              {completed}/{total}
            </Text>
            <Text style={[styles.subtitle, { color: BobbleColors.textOnPrimary }]}>
              Tasks done
            </Text>
          </View>
        </View>
      </View>
      <View style={styles.footer}>
        <View style={[styles.track, { backgroundColor: '#EDE9F7' }]}>
          <View
            style={[
              styles.fill,
              {
                width: `${progress * 100}%`,
                backgroundColor: progress > 0.9 ? BobbleColors.success : BobbleColors.primary,
              },
            ]}
          />
        </View>
        <Text
          style={[
            styles.subtitle,
            { color: BobbleColors.textSecondary, fontSize: Platform.OS === 'ios' ? 11.5 : 13 },
          ]}
        >
          {renderSubtitle(subtitle)}
        </Text>
      </View>
      <View style={styles.mascotWrap} pointerEvents="none">
        <Image source={mascot} style={styles.mascot} contentFit="contain" />
      </View>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  card: {
    height: '100%',
    width: '49%',
    borderRadius: 20,
    minHeight: 150,
    justifyContent: 'space-between',
    overflow: 'hidden',
  },
  top: {
    height: '60%',
    paddingHorizontal: 14,
    paddingTop: 14,
  },
  title: {
    ...Typography.caption,
    fontFamily: Typography.button.fontFamily,
    fontSize: 16,
  },
  body: {
    flex: 1,
    justifyContent: 'flex-start',
    paddingTop: '10%',
  },
  countWrap: {
    maxWidth: '55%',
    zIndex: 2,
  },
  count: {
    ...Typography.heading,
  },
  subtitle: {
    ...Typography.caption,
    fontSize: 12,
    lineHeight: 18,
  },
  mascotWrap: {
    position: 'absolute',
    right: 2,
    bottom: '39%',
    width: 112,
    height: 112,
    zIndex: 1,
  },
  mascot: {
    width: '100%',
    height: '100%',
  },
  footer: {
    backgroundColor: 'white',
    height: '40%',
    paddingHorizontal: 14,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    justifyContent: 'space-evenly',
  },
  track: {
    height: 10,
    borderRadius: 999,
    overflow: 'hidden',
  },
  fill: {
    height: '100%',
    borderRadius: 999,
  },
});
