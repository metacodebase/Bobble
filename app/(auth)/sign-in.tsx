import { Href, router } from 'expo-router';
import { useState } from 'react';
import { Platform, StyleSheet, Text, View } from 'react-native';

import { OnboardingScreenLayout } from '@/src/components/onboarding/onboarding-screen-layout';
import { SocialButton } from '@/src/components/onboarding/social-button';
import { useSocialAuth } from '@/src/features/auth/use-social-auth';
import { useBobbleColors } from '@/src/hooks/use-bobble-colors';
import { Typography } from '@/src/theme/fonts';
import { toast } from '@/src/utils/toast';

const SOCIAL_PROVIDERS = [
  { provider: 'x' as const, label: 'Continue with X' },
  { provider: 'facebook' as const, label: 'Continue with Facebook' },
  { provider: 'google' as const, label: 'Continue with Google' },
  { provider: 'microsoft' as const, label: 'Continue with Microsoft' },
  { provider: 'apple' as const, label: 'Continue with Apple' },
];

type AuthMode = 'sign-in' | 'sign-up';

const AUTH_COPY: Record<AuthMode, { footerPrompt: string; footerAction: string }> = {
  'sign-in': {
    footerPrompt: "Don't have an account?",
    footerAction: 'Sign up',
  },
  'sign-up': {
    footerPrompt: 'Already have an account?',
    footerAction: 'Sign in',
  },
};

function AuthHeading({ mode }: { mode: AuthMode }) {
  const colors = useBobbleColors();

  if (mode === 'sign-in') {
    return (
      <Text style={[styles.heading, { color: colors.text }]}>
        Welcome back.{'\n'}
        <Text style={[Typography.accentSubtitle, { color: colors.textAccent }]}>
          Let&apos;s unwind
        </Text>
        {'\n'}
        together.
      </Text>
    );
  }

  return (
    <Text style={[styles.heading, { color: colors.text }]}>Create your account</Text>
  );
}

export default function AuthScreen() {
  const colors = useBobbleColors();
  const [mode, setMode] = useState<AuthMode>('sign-in');
  const copy = AUTH_COPY[mode];
  const { signInWithGoogle, signInWithApple, appleAvailable, isPending } = useSocialAuth();

  const handleEmailAuth = () => {
    router.push('/(auth)/create-account' as Href);
  };

  const handleSocialPress = (provider: (typeof SOCIAL_PROVIDERS)[number]['provider']) => {
    if (isPending) return;
    switch (provider) {
      case 'google':
        void signInWithGoogle();
        break;
      case 'apple':
        void signInWithApple();
        break;
      default:
        // Facebook, X and Microsoft are not wired up yet.
        toast.success('This sign-in option is coming soon');
    }
  };

  const visibleProviders = SOCIAL_PROVIDERS.filter(
    // "Sign in with Apple" is only offered where it's actually available (iOS 13+).
    (item) => item.provider !== 'apple' || (Platform.OS === 'ios' && appleAvailable),
  );

  const toggleMode = () => {
    setMode((current) => (current === 'sign-in' ? 'sign-up' : 'sign-in'));
  };

  return (
    <OnboardingScreenLayout contentStyle={styles.content}>
      <View style={styles.header}>
        <AuthHeading mode={mode} />
      </View>

      <View style={styles.buttons}>
        {visibleProviders.map((item) => (
          <SocialButton
            key={item.provider}
            provider={item.provider}
            label={item.label}
            onPress={() => handleSocialPress(item.provider)}
          />
        ))}

        <Text style={[styles.dividerText, { color: colors.text }]}>or</Text>

        <SocialButton provider="email" label="Continue with Email" onPress={handleEmailAuth} />
      </View>

      <View style={styles.footer}>
        <Text style={[styles.footerText, { color: colors.text }]}>
          {copy.footerPrompt}{' '}
          <Text style={[styles.footerLink, { color: colors.textAccent }]} onPress={toggleMode}>
            {copy.footerAction}
          </Text>
        </Text>
      </View>
    </OnboardingScreenLayout>
  );
}

const styles = StyleSheet.create({
  content: {
    justifyContent: 'space-between',
    width: '90%',
    alignSelf: 'center',
  },
  header: {
    marginTop: 24,
  },
  heading: {
    ...Typography.heading,
  },
  buttons: {
    gap: 14,
  },
  dividerText: {
    ...Typography.divider,
    textAlign: 'center',
    marginVertical: 4,
  },
  footer: {
    alignItems: 'center',
    paddingBottom: 8,
  },
  footerText: {
    ...Typography.caption,
  },
  footerLink: {
    ...Typography.caption,
    fontWeight: '600',
  },
});
