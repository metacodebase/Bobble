import { Pressable, StyleSheet, Text } from 'react-native';

import { useBobbleColors } from '@/src/hooks/use-bobble-colors';
import { Typography } from '@/src/theme/fonts';

type TextLinkButtonProps = {
  label: string;
  onPress: () => void;
};

export function TextLinkButton({ label, onPress }: TextLinkButtonProps) {
  const colors = useBobbleColors();

  return (
    <Pressable onPress={onPress} style={styles.wrapper}>
      {({ pressed }) => (
        <Text style={[styles.label, { color: colors.textAccent }, pressed && styles.pressed]}>
          {label}
        </Text>
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
  },
  pressed: {
    opacity: 0.7,
  },
});
