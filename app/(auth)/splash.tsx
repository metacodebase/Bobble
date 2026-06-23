
import { Href, router } from 'expo-router';
import { StyleSheet, Text, View } from 'react-native';

import { BobbleMascot } from '@/src/components/onboarding/bobble-mascot';
import { OnboardingScreenLayout } from '@/src/components/onboarding/onboarding-screen-layout';
import { PrimaryButton } from '@/src/components/onboarding/primary-button';
import { useBobbleColors } from '@/src/hooks/use-bobble-colors';
import { Typography } from '@/src/theme/fonts';

export default function SplashScreen() {
  const colors = useBobbleColors();

  return (
    <OnboardingScreenLayout
      contentStyle={styles.content}
      footer={<PrimaryButton label="Get Started" onPress={() => router.push('/(auth)/onboarding' as Href)} />}
    >
      <View style={styles.header}>
        <Text style={[styles.title, { color: colors.text }]}>Bobble</Text>
        <Text style={[styles.tagline, { color: colors.textAccent }]}>unwind a messy mind</Text>
      </View>
      <BobbleMascot variant="splash" size={1000 * 0.4} />

    </OnboardingScreenLayout>
  );
}

const styles = StyleSheet.create({
  content: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  header: {
    alignItems: 'center',
    gap: 4,
    width: "100%",
  },
  title: {
    ...Typography.splashTitle,
    fontSize: 60,
    lineHeight: 66,
    marginBottom: -4,
  },
  tagline: {
    ...Typography.splashTagline,
  },
});
