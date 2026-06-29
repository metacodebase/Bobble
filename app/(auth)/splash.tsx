
import { Href, router } from 'expo-router';
import * as ExpoSplashScreen from 'expo-splash-screen';
import { useCallback } from 'react';
import { StyleSheet, Text, View } from 'react-native';

import { AccentText } from '@/src/components/onboarding/accent-heading';
import { BobbleMascot } from '@/src/components/onboarding/bobble-mascot';
import { OnboardingScreenLayout } from '@/src/components/onboarding/onboarding-screen-layout';
import { PrimaryButton } from '@/src/components/onboarding/primary-button';
import { Typography } from '@/src/theme/fonts';
import { Colors, getBobbleThemeColors } from '@/src/theme';

const splashColors = getBobbleThemeColors('dark');

export default function AuthSplashScreen() {
  const revealAppSplash = useCallback(() => {
    void ExpoSplashScreen.hideAsync();
  }, []);

  return (
    <OnboardingScreenLayout
      backgroundColor={Colors.dark.background}
      contentStyle={styles.content}
      footer={
        <PrimaryButton
          label="Get Started"
          onPress={() => router.push('/(auth)/onboarding' as Href)}
        />
      }
    >
      <View style={styles.splashBody} onLayout={revealAppSplash}>
        <View style={styles.header}>
          <Text style={[styles.title, { color: splashColors.text }]}>Bobble</Text>
          <Text style={[styles.tagline, { color: splashColors.text }]}>
            Dream, Believe. <AccentText>Bobble.</AccentText> Achieve
          </Text>
        </View>
        <BobbleMascot variant="main" size={1000 * 0.4} />
      </View>
    </OnboardingScreenLayout>
  );
}

const styles = StyleSheet.create({
  content: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  splashBody: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
  },
  header: {
    alignItems: 'center',
    gap: 4,
    width: '100%',
  },
  title: {
    ...Typography.splashTitle,
    fontSize: 76,
    lineHeight: 80,
    marginBottom: -4,
  },
  tagline: {
    ...Typography.splashTagline,
    fontSize: 19,
  },
});
