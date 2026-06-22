import { Ionicons } from '@expo/vector-icons';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { AppleIcon, FacebookIcon, GoogleIcon, XIcon } from '@/src/components/onboarding/social-icons';
import { BobbleColors } from '@/src/theme/colors';
import { Typography } from '@/src/theme/fonts';

type SocialProvider = 'google' | 'apple' | 'facebook' | 'x' | 'email';

type SocialButtonProps = {
  provider: SocialProvider;
  label: string;
  onPress: () => void;
};

const ICON_SIZE = 22;

const SOCIAL_ICON_MAP: Record<Exclude<SocialProvider, 'email'>, () => React.ReactNode> = {
  google: () => <GoogleIcon size={ICON_SIZE} />,
  apple: () => <AppleIcon size={ICON_SIZE} />,
  facebook: () => <FacebookIcon size={ICON_SIZE} />,
  x: () => <XIcon size={ICON_SIZE} />,
};

export function SocialButton({ provider, label, onPress }: SocialButtonProps) {
  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [styles.button, pressed && styles.pressed]}
    >
      <View style={styles.icon}>
        {provider === 'email' ? (
          <Ionicons name="mail-outline" size={ICON_SIZE} color={BobbleColors.text} />
        ) : (
          SOCIAL_ICON_MAP[provider]()
        )}
      </View>
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
