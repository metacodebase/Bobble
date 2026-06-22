import { StyleSheet, Text, View } from 'react-native';

import { BobbleColors } from '@/src/theme/colors';
import { Typography } from '@/src/theme/fonts';

type CreateAccountHeaderProps = {
  title: string;
  subtitle: string;
};

export function CreateAccountHeader({ title, subtitle }: CreateAccountHeaderProps) {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>{title}</Text>
      <Text style={styles.subtitle}>{subtitle}</Text>
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
    color: BobbleColors.text,
  },
  subtitle: {
    ...Typography.subheading,
    color: BobbleColors.textSecondary,
  },
});
