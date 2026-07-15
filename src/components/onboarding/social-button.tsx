import { Ionicons } from '@expo/vector-icons';
import { ActivityIndicator, Pressable, StyleSheet, Text, View } from 'react-native';

import {
  AppleIcon,
  FacebookIcon,
  GoogleIcon,
  MicrosoftIcon,
  XIcon,
} from '@/src/components/onboarding/social-icons';
import { useBobbleColors } from '@/src/hooks/use-bobble-colors';
import { Typography } from '@/src/theme/fonts';

type SocialProvider = 'google' | 'apple' | 'facebook' | 'x' | 'microsoft' | 'email';

type SocialButtonProps = {
  provider: SocialProvider;
  label: string;
  onPress: () => void;
  loading?: boolean;
  disabled?: boolean;
};

const ICON_SIZE = 22;

function renderSocialIcon(provider: Exclude<SocialProvider, 'email'>, color: string) {
  switch (provider) {
    case 'google':
      return <GoogleIcon size={ICON_SIZE} />;
    case 'apple':
      return <AppleIcon size={ICON_SIZE} color={color} />;
    case 'facebook':
      return <FacebookIcon size={ICON_SIZE} />;
    case 'x':
      return <XIcon size={ICON_SIZE} color={color} />;
    case 'microsoft':
      return <MicrosoftIcon size={ICON_SIZE} />;
  }
}

export function SocialButton({
  provider,
  label,
  onPress,
  loading = false,
  disabled = false,
}: SocialButtonProps) {
  const colors = useBobbleColors();
  const isDisabled = disabled || loading;

  return (
    <Pressable
      onPress={onPress}
      disabled={isDisabled}
      style={({ pressed }) => [
        styles.button,
        {
          backgroundColor: pressed && !isDisabled ? colors.borderLight : colors.surface,
          borderColor: colors.border,
        },
        pressed && !isDisabled && styles.pressed,
        isDisabled && styles.disabled,
      ]}
    >
      <View style={styles.icon}>
        {loading ? (
          <ActivityIndicator size="small" color={colors.textAccent} />
        ) : provider === 'email' ? (
          <Ionicons name="mail-outline" size={ICON_SIZE} color={colors.text} />
        ) : (
          renderSocialIcon(provider, colors.text)
        )}
      </View>
      <Text style={[styles.label, { color: colors.text, paddingLeft: 10 }]}>{label}</Text>
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
  disabled: {
    opacity: 0.6,
  },
  icon: {
    position: 'absolute',
    left: 24,
  },
  label: {
    ...Typography.socialButton,
    textAlign: 'left',
    width: '80%',
  },
  chevron: {
    position: 'absolute',
    right: 24,
  },
});
