import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';

import { GAMIFICATION } from '@/src/data/demo-data';
import { useBobbleColors } from '@/src/hooks/use-bobble-colors';
import { Typography } from '@/src/theme/fonts';

export function BadgeRow() {
  const colors = useBobbleColors();

  return (
    <View style={styles.section}>
      <View style={styles.header}>
        <Text style={[styles.title, { color: colors.text }]}>Badges</Text>
        <Pressable>
          <Text style={[styles.viewAll, { color: colors.primary }]}>View all</Text>
        </Pressable>
      </View>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.row}>
        {GAMIFICATION.badges.map((badge) => (
          <View
            key={badge}
            style={[
              styles.badge,
              { backgroundColor: colors.primaryMuted + '40', borderColor: colors.primaryMuted },
            ]}
          >
            <Text style={[styles.badgeText, { color: colors.primaryDark }]}>{badge}</Text>
          </View>
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  section: {
    marginBottom: 16,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  title: {
    ...Typography.formLabel,
    fontSize: 16,
  },
  viewAll: {
    ...Typography.caption,
    fontFamily: Typography.button.fontFamily,
  },
  row: {
    gap: 10,
  },
  badge: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 20,
    borderWidth: 1,
  },
  badgeText: {
    ...Typography.caption,
    fontFamily: Typography.button.fontFamily,
  },
});
