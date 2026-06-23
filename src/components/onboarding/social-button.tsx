import { Ionicons } from '@expo/vector-icons';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { AppleIcon, FacebookIcon, GoogleIcon, XIcon } from '@/src/components/onboarding/social-icons';
import { useBobbleColors } from '@/src/hooks/use-bobble-colors';
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
  const colors = useBobbleColors();

  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [
        styles.button,
        {
          backgroundColor: pressed ? colors.borderLight : colors.surface,
          borderColor: colors.border,
        },
        pressed && styles.pressed,
      ]}
    >
      <View style={styles.icon}>
        {provider === 'email' ? (
          <Ionicons name="mail-outline" size={ICON_SIZE} color={colors.text} />
        ) : (
          SOCIAL_ICON_MAP[provider]()
        )}
      </View>
      <Text style={[styles.label, { color: colors.text }]}>{label}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderRadius: 32,
    paddingVertical: 16,
    paddingHorizontal: 20,
    width: '100%',
  },
  pressed: {
    opacity: 0.9,
  },
  icon: {
    position: 'absolute',
    left: 24,
  },
  label: {
    ...Typography.socialButton,
  },
});
