import { Href, router } from 'expo-router';
import { useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';

import { OnboardingScreenLayout } from '@/src/components/onboarding/onboarding-screen-layout';
import { SocialButton } from '@/src/components/onboarding/social-button';
import { BobbleColors } from '@/src/theme/colors';
import { Typography } from '@/src/theme/fonts';

const SOCIAL_PROVIDERS = [
  { provider: 'google' as const, label: 'Continue with Google' },
  { provider: 'apple' as const, label: 'Continue with Apple' },
  { provider: 'facebook' as const, label: 'Continue with Facebook' },
  { provider: 'x' as const, label: 'Continue with X' },
];

type AuthMode = 'sign-in' | 'sign-up';

const AUTH_COPY: Record<AuthMode, { title: string; footerPrompt: string; footerAction: string }> = {
  'sign-in': {
    title: 'Welcome back',
    footerPrompt: "Don't have an account?",
    footerAction: 'Sign up',
  },
  'sign-up': {
    title: 'Create your account',
    footerPrompt: 'Already have an account?',
    footerAction: 'Sign in',
  },
};

export default function AuthScreen() {
  const [mode, setMode] = useState<AuthMode>('sign-in');
  const copy = AUTH_COPY[mode];

  const handleAuth = () => {
    router.push('/(auth)/create-account' as Href);
  };

  const toggleMode = () => {
    setMode((current) => (current === 'sign-in' ? 'sign-up' : 'sign-in'));
  };

  return (
    <OnboardingScreenLayout contentStyle={styles.content}>
      <View style={styles.header}>
        <Text style={styles.title}>{copy.title}</Text>
        <Text style={styles.subtitle}>
          {mode === 'sign-in' ? (
            <>
              Let&apos;s <Text style={styles.accent}>unwind</Text> together
            </>
          ) : (
            <>
              Join Bobble and <Text style={styles.accent}>unwind</Text> your mind
            </>
          )}
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
          {copy.footerPrompt}{' '}
          <Text style={styles.footerLink} onPress={toggleMode}>
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
