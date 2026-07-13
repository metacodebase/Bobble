import { StyleSheet, Text, View } from 'react-native';

import { DEMO_BOBBLE_DETAIL } from '@/src/data/demo-data';
import { useBobbleColors } from '@/src/hooks/use-bobble-colors';
import { useNightForeground } from '@/src/hooks/use-night-foreground';
import { Typography } from '@/src/theme/fonts';

type BobbleDetailSummaryProps = {
  dateLabel?: string;
  durationMin?: number;
};

export function BobbleDetailSummary({
  dateLabel = DEMO_BOBBLE_DETAIL.dateLabel,
  durationMin = DEMO_BOBBLE_DETAIL.durationMin,
}: BobbleDetailSummaryProps) {
  const colors = useBobbleColors();
  const night = useNightForeground();

  return (
    <View style={styles.section}>
      <Text style={[styles.sectionTitle, { color: night.text ?? colors.text }]}>This Bobble</Text>
      <Text style={[styles.meta, { color: night.textSecondary ?? colors.textSecondary }]}>
        {dateLabel} · {durationMin} min
      </Text>
      <View style={styles.list}>
        {DEMO_BOBBLE_DETAIL.bullets.map((item) => (
          <View key={item.label} style={styles.bulletRow}>
            <Text style={[styles.bulletDot, { color: colors.primary }]}>•</Text>
            <Text style={[styles.bulletText, { color: night.text ?? colors.text }]}>
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
  },
  meta: {
    ...Typography.caption,
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
    lineHeight: 24,
  },
  bulletText: {
    ...Typography.body,
    flex: 1,
  },
  bulletLabel: {
    fontFamily: Typography.button.fontFamily,
  },
});
