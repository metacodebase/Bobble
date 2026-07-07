
import { Href, router } from 'expo-router';
import * as ExpoSplashScreen from 'expo-splash-screen';
import { useCallback } from 'react';
import { StyleSheet, Text, View } from 'react-native';

import { BobbleMascot } from '@/src/components/onboarding/bobble-mascot';
import { OnboardingScreenLayout } from '@/src/components/onboarding/onboarding-screen-layout';
import { PrimaryButton } from '@/src/components/onboarding/primary-button';
import { useBobbleColors } from '@/src/hooks/use-bobble-colors';
import { Typography } from '@/src/theme/fonts';

export default function AuthSplashScreen() {
  const colors = useBobbleColors();
  const revealAppSplash = useCallback(() => {
    void ExpoSplashScreen.hideAsync();
  }, []);

  return (
    <OnboardingScreenLayout
      backgroundImage={require('@/src/assets/images/background/one.png')}
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
            <Text style={[styles.title, { color: colors.text }]}>Bobble</Text>
            <Text style={[styles.subtitle, { color: colors.text }]}>Unwind your messy mind</Text>
          </View>
          <BobbleMascot variant="main" size={1000 * 0.4} />
          <View style={styles.tagline}>
            <Text style={[styles.taglineLine, { color: colors.text }]}>Dream. Believe.</Text>
            <Text style={[styles.taglineLine, { color: colors.textAccent }]}>Bobble.</Text>
            <Text style={[styles.taglineLine, { color: colors.text }]}>Achieve.</Text>
          </View>
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
    gap: 12,
    width: '100%',
    marginBottom: 8,
  },
  title: {
    ...Typography.splashTitle,
    fontSize: 76,
    lineHeight: 80,
    marginBottom: -4,
  },
  subtitle: {
    ...Typography.accentSubtitle,
    fontSize: 22,
    textAlign: 'center',
  },
  tagline: {
    alignItems: 'center',
    gap: 2,
    marginTop: 4,
  },
  taglineLine: {
    ...Typography.splashTagline,
    fontSize: 24,
    lineHeight: 30,
    textAlign: 'center',
  },
});
