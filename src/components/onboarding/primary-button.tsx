import { Pressable, StyleSheet, Text, ViewStyle } from 'react-native';

import { BobbleColors } from '@/src/theme/colors';
import { Typography } from '@/src/theme/fonts';

type PrimaryButtonProps = {
  label: string;
  onPress: () => void;
  style?: ViewStyle;
};

export function PrimaryButton({ label, onPress, style }: PrimaryButtonProps) {
  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [styles.button, style, pressed && styles.pressed]}
    >
      <Text style={styles.label}>{label}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    backgroundColor: BobbleColors.primary,
    borderRadius: 32,
    paddingVertical: 18,
    alignItems: 'center',
    justifyContent: 'center',
    width: '90%',
    alignSelf:'center',
  },
  pressed: {
    opacity: 0.9,
    backgroundColor: BobbleColors.primaryDark,
  },
  label: {
    ...Typography.button,
    color: BobbleColors.textOnPrimary,
  },
});
