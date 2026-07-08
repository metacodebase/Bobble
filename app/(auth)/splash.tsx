
import { Href, router } from 'expo-router';
import * as ExpoSplashScreen from 'expo-splash-screen';
import { useCallback } from 'react';
import { Platform, StyleSheet, Text, useWindowDimensions, View } from 'react-native';

import { BobbleMascot } from '@/src/components/onboarding/bobble-mascot';
import { OnboardingScreenLayout } from '@/src/components/onboarding/onboarding-screen-layout';
import { PrimaryButton } from '@/src/components/onboarding/primary-button';
import { useBobbleColors } from '@/src/hooks/use-bobble-colors';
import { Typography } from '@/src/theme/fonts';

const SPLASH_TITLE_COLOR = '#2E2A87';

export default function AuthSplashScreen() {
  const { width, height } = useWindowDimensions();
  const colors = useBobbleColors();
  const referenceWidth = Platform.OS === 'android' ? 412 : 390;
  const referenceHeight = Platform.OS === 'android' ? 915 : 844;
  const scale = Math.min(width / referenceWidth, height / referenceHeight);
  const mascotSize = Math.round(width * 0.75);
  const titleFontSize = Math.round(78 * scale);
  const subtitleFontSize = Math.max(22, Math.round(14 * scale));
  const subtitleLineHeight = subtitleFontSize + 6;
  const taglineFontSize = Math.max(24, Math.round(14 * scale));
  const taglineLineHeight = taglineFontSize + 7;
  const headerBottomSpacing = Math.round(18 * scale);
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
          <View style={[styles.header, { marginBottom: headerBottomSpacing }]}>
            <Text style={[styles.title, { color: SPLASH_TITLE_COLOR, fontSize: titleFontSize, lineHeight: titleFontSize + 4 }]}>
              Bobble
            </Text>
            <Text style={[styles.subtitle, { color: colors.textAccent, fontSize: subtitleFontSize, lineHeight: subtitleLineHeight }]}>
              Unwind your messy mind
            </Text>
          </View>
          <BobbleMascot variant="main" size={mascotSize} />
          <View style={styles.tagline}>
            <Text style={[styles.taglineLine, { color: colors.text, fontSize: taglineFontSize, lineHeight: taglineLineHeight }]}>
              Dream. Believe.
            </Text>
            <Text style={[styles.taglineLine, { color: colors.textAccent, fontSize: taglineFontSize, lineHeight: taglineLineHeight }]}>
              Bobble.
            </Text>
            <Text style={[styles.taglineLine, { color: colors.text, fontSize: taglineFontSize, lineHeight: taglineLineHeight }]}>
              Achieve.
            </Text>
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
    gap: 6,
    width: '100%',
  },
  title: {
    ...Typography.splashTitle,
  },
  subtitle: {
    ...Typography.accentSubtitle,
    textAlign: 'center',
  },
  tagline: {
    alignItems: 'center',
    gap: 2,
    marginTop: 10,
  },
  taglineLine: {
    ...Typography.splashTagline,
    textAlign: 'center',
  },
});
