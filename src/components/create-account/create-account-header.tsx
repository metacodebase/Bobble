import { StyleSheet, Text, View } from 'react-native';

import { useBobbleColors } from '@/src/hooks/use-bobble-colors';
import { Typography } from '@/src/theme/fonts';

type CreateAccountHeaderProps = {
  title: string;
  subtitle: string;
};

export function CreateAccountHeader({ title, subtitle }: CreateAccountHeaderProps) {
  const colors = useBobbleColors();

  return (
    <View style={styles.container}>
      <Text style={[styles.title, { color: colors.text }]}>{title}</Text>
      <Text style={[styles.subtitle, { color: colors.textSecondary }]}>{subtitle}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginTop: 24,
    gap: 8,
  },
  title: {
    ...Typography.heading,
  },
  subtitle: {
    ...Typography.subheading,
  },
});
