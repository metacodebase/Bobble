import { StyleSheet, Text, View } from 'react-native';

import { GAMIFICATION } from '@/src/data/demo-data';
import { BobbleMascot } from '@/src/components/onboarding/bobble-mascot';
import { useBobbleColors } from '@/src/hooks/use-bobble-colors';
import { Typography } from '@/src/theme/fonts';

export function GamificationHeader() {
  const colors = useBobbleColors();
  const progress = GAMIFICATION.currentXp / GAMIFICATION.maxXp;

  return (
    <View style={[styles.root, { backgroundColor: colors.borderLight }]}>
      <View style={styles.topRow}>
        <BobbleMascot variant="main" size={56} />
        <View style={styles.levelBlock}>
          <Text style={[styles.level, { color: colors.primary }]}>Level {GAMIFICATION.level}</Text>
          <Text style={[styles.title, { color: colors.text }]}>{GAMIFICATION.title}</Text>
        </View>
      </View>

      <View style={styles.xpBlock}>
        <View style={styles.xpLabels}>
          <Text style={[styles.xpText, { color: colors.textSecondary }]}>
            {GAMIFICATION.currentXp.toLocaleString()} / {GAMIFICATION.maxXp.toLocaleString()} XP
          </Text>
        </View>
        <View style={[styles.track, { backgroundColor: colors.border }]}>
          <View style={[styles.fill, { width: `${progress * 100}%`, backgroundColor: colors.primary }]} />
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    borderRadius: 20,
    padding: 18,
    gap: 16,
    marginBottom: 20,
  },
  topRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
  },
  levelBlock: {
    gap: 2,
  },
  level: {
    ...Typography.caption,
    fontFamily: Typography.button.fontFamily,
  },
  title: {
    ...Typography.body,
    fontFamily: Typography.button.fontFamily,
    fontSize: 18,
  },
  xpBlock: {
    gap: 8,
  },
  xpLabels: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
  },
  xpText: {
    ...Typography.caption,
  },
  track: {
    height: 8,
    borderRadius: 4,
    overflow: 'hidden',
  },
  fill: {
    height: '100%',
    borderRadius: 4,
  },
});
