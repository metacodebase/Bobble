import { Lock } from 'lucide-react-native';
import { StyleSheet, Text, View } from 'react-native';

import { SettingsScreenLayout } from '@/src/components/settings/settings-screen-layout';
import { STAR_CATALOG } from '@/src/data/stars';
import type { BadgeTone } from '@/src/features/auth/types';
import { useMe } from '@/src/hooks/api';
import { useBobbleColors } from '@/src/hooks/use-bobble-colors';
import { useAppStore } from '@/src/store/app-store';
import { Typography } from '@/src/theme/fonts';

const TONES: Record<BadgeTone, { background: string; foreground: string }> = {
  blue: { background: '#E0F2FE', foreground: '#0284C7' },
  yellow: { background: '#FEF9C3', foreground: '#CA8A04' },
  green: { background: '#DCFCE7', foreground: '#16A34A' },
  purple: { background: '#EDE9FE', foreground: '#7C3AED' },
  red: { background: '#FEE2E2', foreground: '#DC2626' },
};

export default function StarsScreen() {
  const colors = useBobbleColors();
  const storedUser = useAppStore((s) => s.user);
  const { data: fetchedUser } = useMe();
  const user = fetchedUser ?? storedUser;

  const earnedLabels = new Set(
    (user?.gamification?.badges ?? []).map((badge) => badge.label)
  );
  const earnedCount = STAR_CATALOG.filter((star) => earnedLabels.has(star.label)).length;

  return (
    <SettingsScreenLayout title="Your Stars">
      <Text style={[styles.description, { color: colors.textSecondary }]}>
        You&apos;ve earned {earnedCount} of {STAR_CATALOG.length} stars. Complete the goals below
        to unlock the rest.
      </Text>

      <View style={styles.list}>
        {STAR_CATALOG.map((star) => {
          const earned = earnedLabels.has(star.label);
          const tone = TONES[star.tone];
          const Icon = star.icon;

          return (
            <View
              key={star.id}
              style={[
                styles.card,
                { backgroundColor: colors.surface, borderColor: colors.border },
                !earned && styles.cardLocked,
              ]}
            >
              <View
                style={[
                  styles.iconWrap,
                  { backgroundColor: earned ? tone.background : colors.borderLight },
                ]}
              >
                <Icon
                  size={22}
                  color={earned ? tone.foreground : colors.textSecondary}
                  strokeWidth={2}
                />
              </View>

              <View style={styles.body}>
                <View style={styles.titleRow}>
                  <Text style={[styles.label, { color: colors.text }]}>{star.label}</Text>
                  {earned ? (
                    <View style={[styles.pill, { backgroundColor: tone.background }]}>
                      <Text style={[styles.pillText, { color: tone.foreground }]}>Earned</Text>
                    </View>
                  ) : (
                    <Lock size={14} color={colors.textSecondary} strokeWidth={2} />
                  )}
                </View>
                <Text style={[styles.summary, { color: colors.textSecondary }]}>
                  {star.summary}
                </Text>
                <Text style={[styles.howTo, { color: earned ? colors.success : colors.text }]}>
                  {earned ? 'Unlocked' : `How to earn: ${star.howToEarn}`}
                </Text>
              </View>
            </View>
          );
        })}
      </View>
    </SettingsScreenLayout>
  );
}

const styles = StyleSheet.create({
  description: {
    ...Typography.body,
    lineHeight: 22,
  },
  list: {
    gap: 12,
  },
  card: {
    flexDirection: 'row',
    gap: 14,
    padding: 16,
    borderRadius: 16,
    borderWidth: StyleSheet.hairlineWidth,
    alignItems: 'flex-start',
  },
  cardLocked: {
    opacity: 0.75,
  },
  iconWrap: {
    width: 44,
    height: 44,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  body: {
    flex: 1,
    gap: 4,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  label: {
    ...Typography.formLabel,
    fontSize: 16,
  },
  pill: {
    paddingHorizontal: 10,
    paddingVertical: 3,
    borderRadius: 12,
  },
  pillText: {
    ...Typography.caption,
    fontFamily: Typography.button.fontFamily,
    fontSize: 11,
  },
  summary: {
    ...Typography.caption,
  },
  howTo: {
    ...Typography.caption,
    fontFamily: Typography.button.fontFamily,
    marginTop: 2,
  },
});
