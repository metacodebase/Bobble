import { StyleSheet, Text, View } from 'react-native';

import { OnboardingScreenLayout } from '@/src/components/onboarding/onboarding-screen-layout';
import { SocialButton } from '@/src/components/onboarding/social-button';
import { BobbleColors } from '@/src/theme/colors';
import { Typography } from '@/src/theme/fonts';
import { toast } from '@/src/utils/toast';

const SOCIAL_PROVIDERS = [
  { provider: 'google' as const, label: 'Continue with Google' },
  { provider: 'apple' as const, label: 'Continue with Apple' },
  { provider: 'facebook' as const, label: 'Continue with Facebook' },
  { provider: 'x' as const, label: 'Continue with X' },
];

export default function SignInScreen() {
  const handleAuth = () => {
    toast.info('Sign in coming soon');
  };

  return (
    <OnboardingScreenLayout contentStyle={styles.content}>
      <View style={styles.header}>
        <Text style={styles.title}>Welcome back</Text>
        <Text style={styles.subtitle}>
          Let&apos;s <Text style={styles.accent}>unwind</Text> together
        </Text>
      </View>

      <View style={styles.buttons}>
        {SOCIAL_PROVIDERS.map((item) => (
          <SocialButton
            key={item.provider}
            provider={item.provider}
            label={item.label}
            onPress={handleAuth}
          />
        ))}

        <View style={styles.dividerRow}>
          <View style={styles.dividerLine} />
          <Text style={styles.dividerText}>or</Text>
          <View style={styles.dividerLine} />
        </View>

        <SocialButton provider="email" label="Continue with Email" onPress={handleAuth} />
      </View>

      <View style={styles.footer}>
        <Text style={styles.footerText}>
          Don&apos;t have an account?{' '}
          <Text style={styles.footerLink} onPress={handleAuth}>
            Sign up
          </Text>
        </Text>
      </View>
    </OnboardingScreenLayout>
  );
}

const styles = StyleSheet.create({
  content: {
    justifyContent: 'space-between',
  },
  header: {
    marginTop: 24,
    gap: 8,
  },
  title: {
    ...Typography.heading,
    color: BobbleColors.text,
  },
  subtitle: {
    ...Typography.subheading,
    color: BobbleColors.text,
  },
  accent: {
    color: BobbleColors.textAccent,
    fontFamily: Typography.subheading.fontFamily,
    fontWeight: '600',
  },
  buttons: {
    gap: 14,
  },
  dividerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
    marginVertical: 4,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: BobbleColors.divider,
  },
  dividerText: {
    ...Typography.divider,
    color: BobbleColors.textSecondary,
  },
  footer: {
    alignItems: 'center',
    paddingBottom: 8,
  },
  footerText: {
    ...Typography.caption,
    color: BobbleColors.textSecondary,
  },
  footerLink: {
    ...Typography.caption,
    color: BobbleColors.textAccent,
    textDecorationLine: 'underline',
    fontWeight: '600',
  },
});
