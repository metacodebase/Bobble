import { ReactNode } from 'react';
import { StyleSheet, Text, View } from 'react-native';

import { BobbleColors } from '@/src/theme/colors';
import { Typography } from '@/src/theme/fonts';

type FormFieldProps = {
  label: string;
  children: ReactNode;
};

export function FormField({ label, children }: FormFieldProps) {
  return (
    <View style={styles.container}>
      <Text style={styles.label}>{label}</Text>
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: 8,
  },
  label: {
    ...Typography.formLabel,
    color: BobbleColors.textSecondary,
  },
});
