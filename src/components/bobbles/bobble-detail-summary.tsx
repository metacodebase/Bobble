import { StyleSheet, Text, View } from 'react-native';

import { DEMO_BOBBLE_DETAIL } from '@/src/data/demo-data';
import { BobbleColors } from '@/src/theme/colors';
import { Typography } from '@/src/theme/fonts';

type BobbleDetailSummaryProps = {
  dateLabel?: string;
  durationMin?: number;
};

export function BobbleDetailSummary({
  dateLabel = DEMO_BOBBLE_DETAIL.dateLabel,
  durationMin = DEMO_BOBBLE_DETAIL.durationMin,
}: BobbleDetailSummaryProps) {
  return (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>This Bobble</Text>
      <Text style={styles.meta}>
        {dateLabel} · {durationMin} min
      </Text>
      <View style={styles.list}>
        {DEMO_BOBBLE_DETAIL.bullets.map((item) => (
          <View key={item.label} style={styles.bulletRow}>
            <Text style={styles.bulletDot}>•</Text>
            <Text style={styles.bulletText}>
              <Text style={styles.bulletLabel}>{item.label}: </Text>
              {item.value}
            </Text>
          </View>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  section: {
    gap: 10,
  },
  sectionTitle: {
    ...Typography.formLabel,
    fontSize: 16,
    color: BobbleColors.text,
  },
  meta: {
    ...Typography.caption,
    color: BobbleColors.textSecondary,
  },
  list: {
    gap: 10,
    marginTop: 4,
  },
  bulletRow: {
    flexDirection: 'row',
    gap: 8,
  },
  bulletDot: {
    ...Typography.body,
    color: BobbleColors.primary,
    lineHeight: 24,
  },
  bulletText: {
    ...Typography.body,
    color: BobbleColors.text,
    flex: 1,
  },
  bulletLabel: {
    fontFamily: Typography.button.fontFamily,
  },
});
