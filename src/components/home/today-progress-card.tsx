import { BobbleColors } from '@/src/theme/colors';
import { Typography } from '@/src/theme/fonts';
import { Image } from 'expo-image';
import { LinearGradient } from 'expo-linear-gradient';
import { StyleSheet, Text, View } from 'react-native';

const SOUND_MASCOT = require('@/src/assets/images/bobble-sound.png');

type TodayProgressCardProps = {
  completed?: number;
  total?: number;
  subtitle?: string;
};

export function TodayProgressCard({
  completed = 0,
  total = 3,
  subtitle = 'Start with one small task, Bobble will celebrate the rest.',
}: TodayProgressCardProps) {
  const progress = total > 0 ? Math.min(completed / total, 1) : 0;

  return (
    <LinearGradient
      colors={[BobbleColors.primary, BobbleColors.primaryLight, '#D8B4FE']}
      start={{ x: 0.5, y: 0 }}
      end={{ x: 0.7, y: 1 }}
      style={styles.card}
    >
      <View style={{ height: "60%", paddingHorizontal: 14, paddingTop: 14 }}>
        <Text style={[styles.title, { color: BobbleColors.textOnPrimary }]}>Today's Progress</Text>
        <View style={styles.body}>
          <View style={styles.row}>
            <View style={{ width: "40%" }}>
              <Text style={[styles.count, { color: BobbleColors.textOnPrimary }]}>
                {completed}/{total}
              </Text>
              <Text style={[styles.subtitle, { color: BobbleColors.textOnPrimary }]}>
                Tasks done
              </Text>
            </View>
            <View style={{ width: "60%" }}>
              <Image source={SOUND_MASCOT} style={styles.mascot} contentFit="cover" />
            </View>
          </View>
        </View>
      </View>
      <View style={{
        backgroundColor: 'white', height: "40%", paddingHorizontal: 14, paddingBottom: 14,
        justifyContent: "space-evenly"
      }}>
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
    </LinearGradient >
  );
}

const styles = StyleSheet.create({
  card: {
    height: '100%',
    width: "49%",
    borderRadius: 20,
    minHeight: 150,
    justifyContent: 'space-between',
    gap: 12,
    overflow: 'hidden',
  },
  title: {
    ...Typography.caption,
    fontFamily: Typography.button.fontFamily,
    fontSize: 13,
  },
  body: {
    flex: 1,
    justifyContent: 'flex-end',
    gap: 10
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  width: "100%",
  },
  count: {
    ...Typography.heading,
    zIndex: 1000,
  },
  subtitle: {
    ...Typography.caption,
    fontSize: 12,
    lineHeight: 18,
  },
  mascot: {
    width: "100%",
    height: "100%",
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
