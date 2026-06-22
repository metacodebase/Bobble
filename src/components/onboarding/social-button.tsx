import { Ionicons } from '@expo/vector-icons';
import { Pressable, StyleSheet, Text } from 'react-native';

import { BobbleColors } from '@/src/theme/colors';
import { Typography } from '@/src/theme/fonts';

type SocialProvider = 'google' | 'apple' | 'facebook' | 'x' | 'email';

type SocialButtonProps = {
  provider: SocialProvider;
  label: string;
  onPress: () => void;
};

const ICON_MAP: Record<SocialProvider, keyof typeof Ionicons.glyphMap> = {
  google: 'logo-google',
  apple: 'logo-apple',
  facebook: 'logo-facebook',
  x: 'logo-twitter',
  email: 'mail-outline',
};

export function SocialButton({ provider, label, onPress }: SocialButtonProps) {
  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [styles.button, pressed && styles.pressed]}
    >
      <Ionicons name={ICON_MAP[provider]} size={22} color={BobbleColors.text} style={styles.icon} />
      <Text style={styles.label}>{label}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: BobbleColors.background,
    borderWidth: 1,
    borderColor: BobbleColors.border,
    borderRadius: 32,
    paddingVertical: 16,
    paddingHorizontal: 20,
    width: '100%',
  },
  pressed: {
    backgroundColor: BobbleColors.borderLight,
  },
  icon: {
    position: 'absolute',
    left: 24,
  },
  label: {
    ...Typography.socialButton,
    color: BobbleColors.text,
  },
});
