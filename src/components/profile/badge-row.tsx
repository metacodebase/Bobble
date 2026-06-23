import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';

import { GAMIFICATION } from '@/src/data/demo-data';
import { BobbleColors } from '@/src/theme/colors';
import { Typography } from '@/src/theme/fonts';

export function BadgeRow() {
  return (
    <View style={styles.section}>
      <View style={styles.header}>
        <Text style={styles.title}>Badges</Text>
        <Pressable>
          <Text style={styles.viewAll}>View all</Text>
        </Pressable>
      </View>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.row}>
        {GAMIFICATION.badges.map((badge) => (
          <View key={badge} style={styles.badge}>
            <Text style={styles.badgeText}>{badge}</Text>
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
    color: BobbleColors.text,
  },
  viewAll: {
    ...Typography.caption,
    color: BobbleColors.primary,
    fontFamily: Typography.button.fontFamily,
  },
  row: {
    gap: 10,
  },
  badge: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 20,
    backgroundColor: BobbleColors.primaryMuted + '40',
    borderWidth: 1,
    borderColor: BobbleColors.primaryMuted,
  },
  badgeText: {
    ...Typography.caption,
    fontFamily: Typography.button.fontFamily,
    color: BobbleColors.primaryDark,
  },
});
