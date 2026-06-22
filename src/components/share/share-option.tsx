import { Pressable, StyleSheet, Text, View } from 'react-native';

import { BobbleColors } from '@/src/theme/colors';
import { Typography } from '@/src/theme/fonts';

type ShareOptionProps = {
  label: string;
  onPress?: () => void;
};

export function ShareOption({ label, onPress }: ShareOptionProps) {
  const initial = label.charAt(0);

  return (
    <Pressable onPress={onPress} style={({ pressed }) => [styles.root, pressed && styles.pressed]}>
      <View style={styles.icon}>
        <Text style={styles.initial}>{initial}</Text>
      </View>
      <Text style={styles.label} numberOfLines={2}>
        {label}
      </Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  root: {
    width: '30%',
    alignItems: 'center',
    gap: 8,
    marginBottom: 20,
  },
  pressed: {
    opacity: 0.85,
  },
  icon: {
    width: 52,
    height: 52,
    borderRadius: 26,
    backgroundColor: BobbleColors.borderLight,
    alignItems: 'center',
    justifyContent: 'center',
  },
  initial: {
    ...Typography.button,
    color: BobbleColors.primary,
  },
  label: {
    ...Typography.caption,
    color: BobbleColors.text,
    textAlign: 'center',
  },
});
