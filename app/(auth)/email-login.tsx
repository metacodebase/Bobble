import { Href, router } from 'expo-router';
import { useState } from 'react';
import {
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';

import { CreateAccountHeader } from '@/src/components/create-account/create-account-header';
import { LabeledTextInput } from '@/src/components/create-account/labeled-text-input';
import { TermsNotice } from '@/src/components/create-account/terms-notice';
import { AccentText } from '@/src/components/onboarding/accent-heading';
import { OnboardingScreenLayout } from '@/src/components/onboarding/onboarding-screen-layout';
import { PrimaryButton } from '@/src/components/onboarding/primary-button';
import { isDemoMode } from '@/src/config/backend';
import { PROFILE_USER } from '@/src/data/demo-data';
import { useLogin } from '@/src/hooks/api';
import { useBobbleColors } from '@/src/hooks/use-bobble-colors';
import { Typography } from '@/src/theme/fonts';
import { toast } from '@/src/utils/toast';

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export default function EmailLoginScreen() {
  const colors = useBobbleColors();
  const login = useLogin();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = async () => {
    if (login.isPending) return;

    if (isDemoMode) {
      try {
        await login.mutateAsync({
          email: email.trim() || PROFILE_USER.email,
          password: password || 'demo-password',
        });
      } catch {
        // Errors are already reported via the mutation onError toasts.
      }
      return;
    }

    if (!EMAIL_REGEX.test(email.trim())) {
      toast.error('Please enter a valid email address');
      return;
    }
    if (!password) {
      toast.error('Please enter your password');
      return;
    }

    try {
      await login.mutateAsync({ email: email.trim(), password });
    } catch {
      // Errors are already reported via the mutation onError toasts.
    }
  };

  return (
    <OnboardingScreenLayout
      contentStyle={styles.content}
      backgroundImage={require('@/src/assets/images/background/five.png')}
      footer={
        <View style={styles.footerGroup}>
          <PrimaryButton
            label="Sign In"
            onPress={() => void handleLogin()}
            loading={login.isPending}
          />
          <TermsNotice prefix="By signing in, you agree to our" />
          <Text style={[styles.footerText, { color: colors.text }]}>
            Don&apos;t have an account?{' '}
            <Text
              style={[styles.footerLink, { color: colors.textAccent }]}
              onPress={() => router.replace('/(auth)/create-account' as Href)}
            >
              Sign up
            </Text>
          </Text>
        </View>
      }
    >
      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <ScrollView
          style={styles.flex}
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          <CreateAccountHeader>
            Welcome back{'\n'}
            <AccentText>Sign in with email</AccentText>
          </CreateAccountHeader>

          <View style={styles.formGroup}>
            <LabeledTextInput
              label="Email"
              placeholder="you@example.com"
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              autoCapitalize="none"
              autoCorrect={false}
              autoComplete="email"
              textContentType="emailAddress"
              returnKeyType="next"
            />
            <LabeledTextInput
              label="Password"
              placeholder="Enter your password"
              value={password}
              onChangeText={setPassword}
              secureTextEntry
              autoCapitalize="none"
              autoComplete="password"
              textContentType="password"
              returnKeyType="done"
              onSubmitEditing={() => void handleLogin()}
            />
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </OnboardingScreenLayout>
  );
}

const FOOTER_LINE_HEIGHT = 20;

const styles = StyleSheet.create({
  content: {
    width: '90%',
    alignSelf: 'center',
  },
  flex: {
    flex: 1,
    width: '100%',
  },
  scrollContent: {
    flexGrow: 1,
    paddingBottom: 16,
    width: '100%',
  },
  formGroup: {
    marginTop: 28,
    gap: 20,
    width: '90%',
    alignSelf: 'center',
  },
  footerGroup: {
    gap: 12,
    alignItems: 'center',
    width: '100%',
    alignSelf: 'center',
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
