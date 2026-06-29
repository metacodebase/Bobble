import { StyleSheet, Text, View } from 'react-native';

import { useBobbleColors } from '@/src/hooks/use-bobble-colors';
import { Typography } from '@/src/theme/fonts';

type StatCardProps = {
  label: string;
  value: string | number;
  compact?: boolean;
};

export function StatCard({ label, value, compact }: StatCardProps) {
  const colors = useBobbleColors();

  return (
    <View style={[styles.card, compact && styles.cardCompact, { backgroundColor: colors.surface }]}>
      <Text style={[styles.value, compact && styles.valueCompact, { color: colors.text }]}>{value}</Text>
      <Text style={[styles.label, compact && styles.labelCompact, { color: colors.textSecondary }]}>
        {label}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    flex: 1,
    borderRadius: 16,
    paddingVertical: 16,
    paddingHorizontal: 12,
    alignItems: 'center',
    gap: 4,
  },
  cardCompact: {
    borderRadius: 12,
    paddingVertical: 12,
    paddingHorizontal: 6,
    gap: 2,
  },
  value: {
    ...Typography.heading,
    fontSize: 22,
    lineHeight: 28,
  },
  valueCompact: {
    fontSize: 18,
    lineHeight: 24,
  },
  label: {
    ...Typography.caption,
    textAlign: 'center',
  },
  labelCompact: {
    fontSize: 11,
    lineHeight: 14,
  },
});
