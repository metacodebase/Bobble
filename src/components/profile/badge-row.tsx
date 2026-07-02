import { ChevronRight, Star } from 'lucide-react-native';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';

import type { Badge, BadgeTone } from '@/src/features/auth/types';
import { useBobbleColors } from '@/src/hooks/use-bobble-colors';
import { Typography } from '@/src/theme/fonts';

const BADGE_TONES: Record<BadgeTone, { background: string; foreground: string }> = {
  blue: {
    background: '#E0F2FE',
    foreground: '#0284C7',
  },
  yellow: {
    background: '#FEF9C3',
    foreground: '#CA8A04',
  },
  green: {
    background: '#DCFCE7',
    foreground: '#16A34A',
  },
  purple: {
    background: '#EDE9FE',
    foreground: '#7C3AED',
  },
  red: {
    background: '#FEE2E2',
    foreground: '#DC2626',
  },
};

type BadgeRowProps = {
  badges?: Badge[];
  onSeeAll?: () => void;
};

export function BadgeRow({ badges = [], onSeeAll }: BadgeRowProps) {
  const colors = useBobbleColors();

  return (
    <View style={styles.section}>
      <Pressable
        style={styles.header}
        onPress={onSeeAll}
        disabled={!onSeeAll}
        hitSlop={8}
      >
        <Text style={[styles.title, { color: colors.text }]}>Your Stars</Text>
        {onSeeAll ? (
          <View style={styles.seeAll}>
            <Text style={[styles.seeAllText, { color: colors.primary }]}>See all</Text>
            <ChevronRight size={16} color={colors.primary} strokeWidth={2.5} />
          </View>
        ) : null}
      </Pressable>
      {badges.length === 0 ? (
        <Text style={[styles.empty, { color: colors.textSecondary }]}>
          Earn stars by capturing bobbles and completing tasks.
        </Text>
      ) : (
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.row}
        >
          {badges.map((badge) => {
            const tone = BADGE_TONES[badge.tone] ?? BADGE_TONES.blue;

            return (
              <View key={badge.label} style={[styles.badge, { backgroundColor: tone.background }]}>
                <Star size={14} color={tone.foreground} fill={tone.foreground} strokeWidth={0} />
                <Text style={[styles.badgeText, { color: tone.foreground }]}>{badge.label}</Text>
              </View>
            );
          })}
        </ScrollView>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  section: {
    marginBottom: 24,
    gap: 12,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  title: {
    ...Typography.formLabel,
    fontSize: 16,
  },
  seeAll: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 2,
  },
  seeAllText: {
    ...Typography.caption,
    fontFamily: Typography.button.fontFamily,
  },
  empty: {
    ...Typography.caption,
  },
  row: {
    gap: 10,
  },
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 20,
  },
  badgeText: {
    ...Typography.caption,
    fontFamily: Typography.button.fontFamily,
  },
});
