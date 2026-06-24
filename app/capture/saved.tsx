import { Href, router } from 'expo-router';
import { StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { ConfettiDecoration } from '@/src/components/capture/confetti-decoration';
import { SecondaryButton } from '@/src/components/home/secondary-button';
import { BobbleMascot } from '@/src/components/onboarding/bobble-mascot';
import { PrimaryButton } from '@/src/components/onboarding/primary-button';
import { useBobbleColors } from '@/src/hooks/use-bobble-colors';
import { Typography } from '@/src/theme/fonts';

export default function SavedScreen() {
  const colors = useBobbleColors();
  const insets = useSafeAreaInsets();

  return (
    <View
      style={[
        styles.root,
        {
          paddingTop: insets.top + 24,
          paddingBottom: insets.bottom + 24,
          backgroundColor: colors.background,
        },
      ]}
    >
      <ConfettiDecoration />

      <View style={styles.content}>
        <BobbleMascot variant="waving" size={180} />
        <Text style={[styles.title, { color: colors.text }]}>Bobble saved!</Text>
        <Text style={[styles.subtitle, { color: colors.textSecondary }]}>
          Your thoughts are organised and ready when you are.
        </Text>
      </View>

      <View style={styles.actions}>
        <PrimaryButton
          label="View Bobble"
          onPress={() => router.replace({ pathname: '/bobble/[id]', params: { id: '1' } } as Href)}
        />
        <SecondaryButton
          label="Back to Home"
          onPress={() => router.replace('/(tabs)' as Href)}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    paddingHorizontal: 28,
  },
  content: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 12,
    paddingHorizontal: 8,
  },
  title: {
    ...Typography.heading,
    textAlign: 'center',
    marginTop: 8,
  },
  subtitle: {
    ...Typography.body,
    textAlign: 'center',
    maxWidth: 280,
  },
  actions: {
    gap: 12,
  },
});
