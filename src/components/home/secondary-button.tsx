import { LucideIcon } from 'lucide-react-native';
import { Pressable, StyleSheet, Text, View, ViewStyle } from 'react-native';

import { BobbleColors } from '@/src/theme/colors';
import { Typography } from '@/src/theme/fonts';

type SecondaryButtonProps = {
  label: string;
  onPress: () => void;
  icon?: LucideIcon;
  style?: ViewStyle;
};

export function SecondaryButton({ label, onPress, icon: Icon, style }: SecondaryButtonProps) {
  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [styles.button, style, pressed && styles.pressed]}
    >
      {Icon ? (
        <View style={styles.icon}>
          <Icon size={20} color={BobbleColors.primary} strokeWidth={2} />
        </View>
      ) : null}
      <Text style={styles.label}>{label}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
    backgroundColor: BobbleColors.background,
    borderRadius: 32,
    borderWidth: 1.5,
    borderColor: BobbleColors.primary,
    paddingVertical: 18,
    width: '100%',
  },
  pressed: {
    opacity: 0.9,
    backgroundColor: BobbleColors.borderLight,
  },
  icon: {
    marginTop: 1,
  },
  label: {
    ...Typography.button,
    color: BobbleColors.primary,
  },
});
