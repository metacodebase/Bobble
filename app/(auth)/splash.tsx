
import { OnboardingScreenLayout } from '@/src/components/onboarding/onboarding-screen-layout';
import { PrimaryButton } from '@/src/components/onboarding/primary-button';
import { useBobbleColors } from '@/src/hooks/use-bobble-colors';
import { Typography } from '@/src/theme/fonts';
import { Image } from 'expo-image';
import { Href, router } from 'expo-router';
import * as ExpoSplashScreen from 'expo-splash-screen';
import { useCallback } from 'react';
import { Platform, StyleSheet, Text, useWindowDimensions, View } from 'react-native';

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
      backgroundImage={require('@/src/assets/images/background/two.png')}
      contentStyle={styles.content}
      footer={
        <View style={{ width: '100%',paddingTop:10,gap:10}}>
          <PrimaryButton
            label="Get Started"
            onPress={() => router.push('/(auth)/onboarding' as Href)}
          />
          <View style={styles.footer}>
            <Text style={[styles.footerText, { color: colors.text }]}>
              Don't have an account?{' '}
              <Text
                style={[styles.footerLink, { color: colors.textAccent }]}
                onPress={() => router.push('/(auth)/sign-in' as Href)}
              >
                Login
              </Text>
            </Text>
          </View>
        </View>
      }
    >

      <View style={styles.splashBody} onLayout={revealAppSplash}>
        <View style={[styles.header, { marginBottom: headerBottomSpacing }]}>
          <Text style={[styles.title, { color: '#0B0944', fontSize: titleFontSize, lineHeight: titleFontSize + 4 }]}>
            Bobble
          </Text>
          <Text style={[styles.subtitle, { color: colors.textAccent, fontSize: subtitleFontSize, lineHeight: subtitleLineHeight }]}>
            Unwind your messy mind
          </Text>
        </View>
        <Image source={require('../../src/assets/images/bobble-splash.png')}
          style={{ width: '90%', height: 300, borderRadius: 20 }}
          contentFit="contain"
        />
        <Image
          source={require('@/src/assets/images/bobble-splash-support.png')}
          style={[{ width: '90%', height: 100, borderRadius: 20 }]}
          contentFit="contain"
        />
        <View style={styles.tagline}>
          <Text style={[styles.taglineLine, { color: colors.textAccent, fontSize: taglineFontSize, lineHeight: taglineLineHeight }]}>
            Dream. <Text style={[styles.taglineLine, { color: '#0B0944', fontSize: taglineFontSize, lineHeight: taglineLineHeight }]}>
              Believe.
            </Text>
          </Text>

          <Text style={[styles.taglineLine, { color: colors.textAccent, fontSize: taglineFontSize, lineHeight: taglineLineHeight }]}>
            Bobble. <Text style={[styles.taglineLine, { color: colors.text, fontSize: taglineFontSize, lineHeight: taglineLineHeight }]}>
              Achieve.
            </Text>
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
    justifyContent: 'space-evenly',
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
  footer: {
    alignItems: 'center',
    // paddingVertical: 8,/
  },
  footerText: {
    ...Typography.caption,
  },
  footerLink: {
    ...Typography.caption,
    fontWeight: '600',
  },
});
