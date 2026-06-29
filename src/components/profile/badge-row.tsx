import { Star } from 'lucide-react-native';
import { ScrollView, StyleSheet, Text, View } from 'react-native';

import { GAMIFICATION } from '@/src/data/demo-data';
import { useBobbleColors } from '@/src/hooks/use-bobble-colors';
import { Typography } from '@/src/theme/fonts';

const BADGE_TONES = {
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
} as const;

export function BadgeRow() {
  const colors = useBobbleColors();

  return (
    <View style={styles.section}>
      <Text style={[styles.title, { color: colors.text }]}>Your Stars</Text>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.row}>
        {GAMIFICATION.badges.map((badge) => {
          const tone = BADGE_TONES[badge.tone];

          return (
            <View key={badge.label} style={[styles.badge, { backgroundColor: tone.background }]}>
              <Star size={14} color={tone.foreground} fill={tone.foreground} strokeWidth={0} />
              <Text style={[styles.badgeText, { color: tone.foreground }]}>{badge.label}</Text>
            </View>
          );
        })}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  section: {
    marginBottom: 24,
    gap: 12,
  },
  title: {
    ...Typography.formLabel,
    fontSize: 16,
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
