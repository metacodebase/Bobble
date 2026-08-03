import { Href, router, useLocalSearchParams } from 'expo-router';
import { useEffect, useMemo, useState } from 'react';
import {
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';

import { CreateAccountHeader } from '@/src/components/create-account/create-account-header';
import { TextLinkButton } from '@/src/components/create-account/text-link-button';
import { AccentText } from '@/src/components/onboarding/accent-heading';
import { OnboardingScreenLayout } from '@/src/components/onboarding/onboarding-screen-layout';
import { PrimaryButton } from '@/src/components/onboarding/primary-button';
import { useResendVerification, useVerifyEmail } from '@/src/hooks/api';
import { useBobbleColors } from '@/src/hooks/use-bobble-colors';
import { Typography } from '@/src/theme/fonts';
import { toast } from '@/src/utils/toast';

const RESEND_SECONDS = 60;

export default function VerifyEmailScreen() {
  const colors = useBobbleColors();
  const params = useLocalSearchParams<{
    email?: string | string[];
    cooldown?: string | string[];
  }>();
  const email = useMemo(() => {
    const value = Array.isArray(params.email) ? params.email[0] : params.email;
    return value?.trim().toLowerCase() ?? '';
  }, [params.email]);
  const [code, setCode] = useState('');
  const [countdown, setCountdown] = useState(() => {
    const value = Array.isArray(params.cooldown) ? params.cooldown[0] : params.cooldown;
    const seconds = Number(value ?? 0);
    return Number.isFinite(seconds) ? Math.max(0, Math.min(RESEND_SECONDS, seconds)) : 0;
  });
  const verify = useVerifyEmail();
  const resend = useResendVerification();

  useEffect(() => {
    if (countdown <= 0) return;
    const timer = setInterval(() => {
      setCountdown((current) => Math.max(0, current - 1));
    }, 1000);
    return () => clearInterval(timer);
  }, [countdown]);

  const handleCodeChange = (value: string) => {
    setCode(value.replace(/\D/g, '').slice(0, 6));
  };

  const handleVerify = async () => {
    if (!email) {
      toast.error('Your email address is missing. Please register again.');
      return;
    }
    if (code.length !== 6) {
      toast.error('Enter the six-digit code');
      return;
    }
    try {
      await verify.mutateAsync({ email, code });
    } catch {
      // The mutation displays the backend error.
    }
  };

  const handleResend = async () => {
    if (!email || countdown > 0 || resend.isPending) return;
    try {
      const result = await resend.mutateAsync({ email });
      setCode('');
      setCountdown(result.retryAfterSeconds || RESEND_SECONDS);
    } catch {
      // The mutation displays the backend error.
    }
  };

  return (
    <OnboardingScreenLayout
      contentStyle={styles.content}
      backgroundImage={require('@/src/assets/images/background/five.png')}
      footer={
        <View style={styles.footer}>
          <PrimaryButton
            label="Verify Email"
            onPress={() => void handleVerify()}
            loading={verify.isPending}
            disabled={code.length !== 6}
          />
          <TextLinkButton
            label="Back to sign in"
            onPress={() => router.replace('/(auth)/email-login' as Href)}
          />
        </View>
      }
    >
      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={0}
      >
        <ScrollView
          style={styles.flex}
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled"
          keyboardDismissMode="on-drag"
          showsVerticalScrollIndicator={false}
        >
          <CreateAccountHeader>
            Check your inbox{`\n`}
            <AccentText>Verify your email</AccentText>
          </CreateAccountHeader>

          <View style={styles.body}>
            <Text style={[styles.instructions, { color: colors.text }]}>
              We sent a six-digit code to{' '}
              <Text style={styles.email}>{email || 'your email address'}</Text>. The code expires in
              10 minutes.
            </Text>
            <TextInput
              value={code}
              onChangeText={handleCodeChange}
              placeholder="000000"
              placeholderTextColor={colors.textSecondary}
              keyboardType="number-pad"
              autoComplete="one-time-code"
              textContentType="oneTimeCode"
              maxLength={6}
              autoFocus
              returnKeyType="done"
              onSubmitEditing={() => void handleVerify()}
              style={[
                styles.codeInput,
                {
                  color: colors.text,
                  backgroundColor: colors.surface,
                  borderColor: colors.border,
                },
              ]}
            />
            <Text style={[styles.help, { color: colors.textSecondary }]}>
              Didn&apos;t receive it? Check spam, confirm the address above, or request another
              code.
            </Text>
            <TextLinkButton
              label={
                countdown > 0
                  ? `Resend code in ${countdown}s`
                  : resend.isPending
                    ? 'Sending…'
                    : 'Resend code'
              }
              onPress={() => void handleResend()}
            />
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </OnboardingScreenLayout>
  );
}

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
    paddingBottom: 24,
  },
  body: {
    width: '90%',
    alignSelf: 'center',
    alignItems: 'center',
    gap: 20,
    marginTop: 32,
  },
  instructions: {
    ...Typography.body,
    textAlign: 'center',
  },
  email: {
    fontWeight: '700',
  },
  codeInput: {
    ...Typography.heading,
    width: '100%',
    borderWidth: StyleSheet.hairlineWidth,
    borderRadius: 18,
    paddingHorizontal: 20,
    paddingVertical: 18,
    textAlign: 'center',
    letterSpacing: 12,
  },
  help: {
    ...Typography.caption,
    textAlign: 'center',
  },
  footer: {
    width: '100%',
    alignItems: 'center',
    gap: 8,
  },
});
