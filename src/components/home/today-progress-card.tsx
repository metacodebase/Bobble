import { Image } from 'expo-image';
import { LinearGradient } from 'expo-linear-gradient';
import { ImageSourcePropType, StyleSheet, Text, View } from 'react-native';

import { BobbleColors } from '@/src/theme/colors';
import { Typography } from '@/src/theme/fonts';

const SOUND_MASCOT = require('@/src/assets/images/bobble-sound.png');
const WRITING_MASCOT = require('@/src/assets/images/bobble-writing.png');
const HAMMER_MASCOT = require('@/src/assets/images/bobble-hammer.png');
const NERD_MASCOT = require('@/src/assets/images/bobble-nerd.png');
const GREET_MASCOT = require('@/src/assets/images/mascot/bobble-greet.png');

function getProgressMascot(completed: number, total: number): ImageSourcePropType {
  if (total <= 0) return SOUND_MASCOT;
  if (completed >= total) return GREET_MASCOT;
  if (completed === total - 1) return NERD_MASCOT;
  if (completed > 0) return HAMMER_MASCOT;
  return WRITING_MASCOT;
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
          <View style={styles.row}>
            <View style={styles.countWrap}>
              <Text style={[styles.count, { color: BobbleColors.textOnPrimary }]}>
                {completed}/{total}
              </Text>
              <Text style={[styles.subtitle, { color: BobbleColors.textOnPrimary }]}>
                Tasks done
              </Text>
            </View>
            <View style={styles.mascotWrap}>
              <Image source={mascot} style={styles.mascot} contentFit="contain" />
            </View>
          </View>
        </View>
      </View>
      <View style={styles.footer}>
        <View style={[styles.track, { backgroundColor: 'rgba(0, 0, 0, 0.1)' }]}>
          <View
            style={[
              styles.fill,
              {
                width: `${progress * 100}%`,
                backgroundColor: BobbleColors.primary,
              },
            ]}
          />
        </View>
        <Text style={[styles.subtitle, { color: BobbleColors.textSecondary }]}>{subtitle}</Text>
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
    fontSize: 13,
  },
  body: {
    flex: 1,
    justifyContent: 'flex-end',
    gap: 10,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '100%',
    flex: 1,
  },
  countWrap: {
    width: '40%',
  },
  count: {
    ...Typography.heading,
    zIndex: 1,
  },
  subtitle: {
    ...Typography.caption,
    fontSize: 12,
    lineHeight: 18,
  },
  mascotWrap: {
    width: '60%',
    height: '100%',
    alignItems: 'center',
    justifyContent: 'flex-end',
  },
  mascot: {
    width: '100%',
    height: '100%',
  },
  footer: {
    backgroundColor: 'white',
    height: '40%',
    paddingHorizontal: 14,
    paddingBottom: 14,
    justifyContent: 'space-evenly',
  },
  track: {
    height: 8,
    borderRadius: 999,
    overflow: 'hidden',
  },
  fill: {
    height: '100%',
    borderRadius: 999,
  },
});
