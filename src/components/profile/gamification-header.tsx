import { StyleSheet, Text, View } from 'react-native';

import { GAMIFICATION } from '@/src/data/demo-data';
import { BobbleMascot } from '@/src/components/onboarding/bobble-mascot';
import { BobbleColors } from '@/src/theme/colors';
import { Typography } from '@/src/theme/fonts';

export function GamificationHeader() {
  const progress = GAMIFICATION.currentXp / GAMIFICATION.maxXp;

  return (
    <View style={styles.root}>
      <View style={styles.topRow}>
        <BobbleMascot variant="sitting" size={56} />
        <View style={styles.levelBlock}>
          <Text style={styles.level}>Level {GAMIFICATION.level}</Text>
          <Text style={styles.title}>{GAMIFICATION.title}</Text>
        </View>
      </View>

      <View style={styles.xpBlock}>
        <View style={styles.xpLabels}>
          <Text style={styles.xpText}>
            {GAMIFICATION.currentXp.toLocaleString()} / {GAMIFICATION.maxXp.toLocaleString()} XP
          </Text>
        </View>
        <View style={styles.track}>
          <View style={[styles.fill, { width: `${progress * 100}%` }]} />
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    backgroundColor: BobbleColors.borderLight,
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
    color: BobbleColors.primary,
  },
  title: {
    ...Typography.body,
    fontFamily: Typography.button.fontFamily,
    fontSize: 18,
    color: BobbleColors.text,
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
    color: BobbleColors.textSecondary,
  },
  track: {
    height: 8,
    borderRadius: 4,
    backgroundColor: BobbleColors.border,
    overflow: 'hidden',
  },
  fill: {
    height: '100%',
    borderRadius: 4,
    backgroundColor: BobbleColors.primary,
  },
});
