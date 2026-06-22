import { StyleSheet, Text, View } from 'react-native';

import { BobbleColors } from '@/src/theme/colors';
import { Typography } from '@/src/theme/fonts';

type StatCardProps = {
  label: string;
  value: string | number;
};

export function StatCard({ label, value }: StatCardProps) {
  return (
    <View style={styles.card}>
      <Text style={styles.value}>{value}</Text>
      <Text style={styles.label}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    flex: 1,
    backgroundColor: BobbleColors.borderLight,
    borderRadius: 16,
    paddingVertical: 16,
    paddingHorizontal: 12,
    alignItems: 'center',
    gap: 4,
  },
  value: {
    ...Typography.heading,
    fontSize: 22,
    lineHeight: 28,
    color: BobbleColors.text,
  },
  label: {
    ...Typography.caption,
    color: BobbleColors.textSecondary,
    textAlign: 'center',
  },
});
