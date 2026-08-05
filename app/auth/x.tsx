import { Href, router } from 'expo-router';
import { useEffect } from 'react';
import { ActivityIndicator, StyleSheet, Text, View } from 'react-native';

import { useBobbleColors } from '@/src/hooks/use-bobble-colors';
import { useAppStore } from '@/src/store/app-store';
import { Typography } from '@/src/theme/fonts';

const CALLBACK_TIMEOUT_MS = 12_000;

/**
 * Native landing route for bobble://auth/x.
 *
 * AuthSession completes the PKCE exchange in the still-mounted sign-in screen.
 * This route prevents the root auth guard from mistaking the OAuth callback for
 * protected app content. If completion fails, return to the exact screen below
 * it (including its sign-in/sign-up mode) instead of sending the user to splash.
 */
export default function XAuthCallbackScreen() {
  const colors = useBobbleColors();
  const hasAppAccess = useAppStore((s) => s.isAuthenticated || s.isGuest);

  useEffect(() => {
    if (hasAppAccess) {
      router.replace('/(tabs)' as Href);
      return;
    }

    // A cold-start callback cannot finish PKCE because the in-memory verifier
    // belonged to the previous app process. Return to auth immediately.
    if (!router.canGoBack()) {
      router.replace('/(auth)/sign-in' as Href);
      return;
    }

    const timeout = setTimeout(() => {
      router.back();
    }, CALLBACK_TIMEOUT_MS);

    return () => clearTimeout(timeout);
  }, [hasAppAccess]);

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <ActivityIndicator size="large" color={colors.textAccent} />
      <Text style={[styles.title, { color: colors.text }]}>Completing X sign-in…</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 16,
    padding: 24,
  },
  title: {
    ...Typography.body,
    textAlign: 'center',
  },
});
