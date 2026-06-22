import { Href, router } from 'expo-router';
import { StyleSheet, Text, View } from 'react-native';

import { BobbleMascot } from '@/src/components/onboarding/bobble-mascot';
import { OnboardingScreenLayout } from '@/src/components/onboarding/onboarding-screen-layout';
import { PrimaryButton } from '@/src/components/onboarding/primary-button';
import { BobbleColors } from '@/src/theme/colors';
import { Typography } from '@/src/theme/fonts';

export default function SplashScreen() {
  return (
    <OnboardingScreenLayout
      contentStyle={styles.content}
      footer={<PrimaryButton label="Get Started" onPress={() => router.push('/(auth)/onboarding' as Href)} />}
    >
      <View style={styles.header}>
        <Text style={styles.title}>Bobble</Text>
        <Text style={styles.tagline}>unwind a messy mind</Text>
      </View>

      <View style={styles.mascotContainer}>
        <BobbleMascot variant="splash" size={240} />
      </View>
    </OnboardingScreenLayout>
  );
}

const styles = StyleSheet.create({
  content: {
    alignItems: 'center',
  },
  header: {
    alignItems: 'center',
    marginTop: 48,
    gap: 8,
  },
  title: {
    ...Typography.splashTitle,
    color: BobbleColors.text,
  },
  tagline: {
    ...Typography.splashTagline,
    color: BobbleColors.textAccent,
  },
  mascotContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
