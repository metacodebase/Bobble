import { Pressable, StyleSheet, Text } from 'react-native';

import { BobbleColors } from '@/src/theme/colors';
import { Typography } from '@/src/theme/fonts';

type TextLinkButtonProps = {
  label: string;
  onPress: () => void;
};

export function TextLinkButton({ label, onPress }: TextLinkButtonProps) {
  return (
    <Pressable onPress={onPress} style={styles.wrapper}>
      {({ pressed }) => (
        <Text style={[styles.label, pressed && styles.pressed]}>{label}</Text>
      )}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    alignItems: 'center',
    paddingVertical: 8,
  },
  label: {
    ...Typography.button,
    color: BobbleColors.textAccent,
  },
  pressed: {
    opacity: 0.7,
  },
});
