import { Href, router } from 'expo-router';
import { useState } from 'react';
import { Platform, StyleSheet, Text, View } from 'react-native';

import { TermsNotice } from '@/src/components/create-account/terms-notice';
import { OnboardingScreenLayout } from '@/src/components/onboarding/onboarding-screen-layout';
import { SocialButton } from '@/src/components/onboarding/social-button';
import { isDemoMode } from '@/src/config/backend';
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
      <View style={styles.headingGroup}>
        <Text style={[styles.heading, { color: colors.text }]}>Welcome back.</Text>
        <Text style={[styles.headingAccent, { color: colors.textAccent }]}>
          Let&apos;s start unwinding
        </Text>
        <Text style={[styles.heading, { color: colors.text }]}>together.</Text>
      </View>
    );
  }

  return (
    <View style={styles.headingGroup}>
      <Text style={[styles.heading, { color: colors.text }]}>Create your account</Text>
    </View>
  );
}

export default function AuthScreen() {
  const colors = useBobbleColors();
  const [mode, setMode] = useState<AuthMode>('sign-in');
  const copy = AUTH_COPY[mode];
  const {
    signInWithGoogle,
    signInWithApple,
    signInDemo,
    appleAvailable,
    isPending,
    pendingProvider,
  } = useSocialAuth();

  const handleEmailAuth = () => {
    if (isPending) return;
    if (mode === 'sign-in') {
      router.push('/(auth)/email-login' as Href);
      return;
    }
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
        if (isDemoMode) {
          signInDemo();
          return;
        }
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
    <OnboardingScreenLayout
      contentStyle={styles.content}
      backgroundImage={require('@/src/assets/images/background/five.png')}
      footer={
        <View style={styles.footerStack}>
          <TermsNotice
            prefix={
              mode === 'sign-up'
                ? 'By signing up, you agree to our'
                : 'By signing in, you agree to our'
            }
          />
          <Text style={[styles.footerText, { color: colors.text }]}>
            {copy.footerPrompt}{' '}
            <Text style={[styles.footerLink, { color: colors.textAccent }]} onPress={toggleMode}>
              {copy.footerAction}
            </Text>
          </Text>
        </View>
      }
    >
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
            loading={pendingProvider === item.provider}
            disabled={isPending}
          />
        ))}

        <Text style={[styles.dividerText, { color: colors.text }]}>or</Text>

        <SocialButton
          provider="email"
          label={mode === 'sign-up' ? 'Sign up with Email' : 'Continue with Email'}
          onPress={handleEmailAuth}
          disabled={isPending}
        />
      </View>
    </OnboardingScreenLayout>
  );
}

const FOOTER_LINE_HEIGHT = 20;
const FOOTER_GAP = 16;

const styles = StyleSheet.create({
  content: {
    width: '80%',
    alignSelf: 'center',
  },
  header: {
    marginTop: 56,
    width: '100%',
  },
  headingGroup: {
    gap: 8,
    marginBottom: 28,
    width: '100%',
    alignSelf: 'center',
  },
  heading: {
    ...Typography.heading,
    textAlign: 'left',
  },
  headingAccent: {
    ...Typography.heading,
    textAlign: 'left',
  },
  buttons: {
    width: '100%',
    gap: Platform.OS === 'ios' ? 10 : 18,
    alignItems: 'center',
    alignSelf: "center",
  },
  dividerText: {
    ...Typography.divider,
    textAlign: 'center',
  },
  footerStack: {
    width: '100%',
    alignItems: 'center',
    gap: FOOTER_GAP,
    paddingTop: 8,
  },
  footerText: {
    ...Typography.caption,
    textAlign: 'center',
    fontSize: 14,
    lineHeight: FOOTER_LINE_HEIGHT,
  },
  footerLink: {
    ...Typography.caption,
    fontSize: 14,
    fontWeight: '600',
    lineHeight: FOOTER_LINE_HEIGHT,
  },
});
