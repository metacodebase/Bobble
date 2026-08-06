import { OnboardingScreenLayout } from '@/src/components/onboarding/onboarding-screen-layout';
import { PrimaryButton } from '@/src/components/onboarding/primary-button';
import { useContinueAsGuest } from '@/src/features/auth/use-continue-as-guest';
import { useBobbleColors } from '@/src/hooks/use-bobble-colors';
import { FontFamily, Typography } from '@/src/theme/fonts';
import { Image } from 'expo-image';
import { Href, router } from 'expo-router';
import * as ExpoSplashScreen from 'expo-splash-screen';
import { useCallback } from 'react';
import { Platform, ScrollView, StyleSheet, Text, useWindowDimensions, View } from 'react-native';

const SPLASH_TITLE_COLOR = '#2E2A87';

export default function AuthSplashScreen() {
  const { width, height } = useWindowDimensions();
  const colors = useBobbleColors();
  const continueAsGuest = useContinueAsGuest();
  const referenceWidth = Platform.OS === 'android' ? 412 : 390;
  const referenceHeight = Platform.OS === 'android' ? 915 : 844;
  const scale = Math.min(width / referenceWidth, height / referenceHeight);
  const clamp = (value: number, min: number, max: number) => Math.min(max, Math.max(min, value));
  const titleFontSize = clamp(Math.round(78 * scale), 44, 78);
  const subtitleFontSize = clamp(Math.round(22 * scale), 10, 20);
  const subtitleLineHeight = subtitleFontSize + 8;
  const taglineFontSize = clamp(Math.round(20 * scale), 18, 26);
  const taglineLineHeight = taglineFontSize + 8;
  const heroImageWidth = clamp(Math.round(width * 0.9), 180, 440);
  const heroImageHeight = clamp(Math.round(height * 0.32), 180, 320);
  const supportImageHeight = clamp(Math.round(height * 0.1), 56, 110);
  const verticalGap = clamp(Math.round(18 * scale), 10, 22);
  const horizontalPadding = clamp(Math.round(width * 0.06), 16, 26);
  const revealAppSplash = useCallback(() => {
    void ExpoSplashScreen.hideAsync();
  }, []);

  return (
    <OnboardingScreenLayout
      backgroundImage={require('@/src/assets/images/background/two.png')}
      contentStyle={{
        alignItems: 'center',
        justifyContent: 'center',
        paddingHorizontal: horizontalPadding,
      }}
      footer={
        <View style={{ width: '100%', paddingTop: 10, gap: Platform.OS === 'android' ? 5 : 0 }}>
          <PrimaryButton
            label="Get Started"
            onPress={() => router.push('/(auth)/onboarding' as Href)}
          />
          <Text
            accessibilityRole="button"
            style={[styles.guestLink, { color: colors.textAccent }]}
            onPress={continueAsGuest}
          >
            Continue as Guest
          </Text>
          <View style={styles.footer}>
            <Text style={[styles.footerText, { color: colors.text }]}>
              Don’t have an account?{' '}
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
      <ScrollView
        style={styles.scrollBody}
        contentContainerStyle={[styles.splashBody, { gap: verticalGap }]}
        showsVerticalScrollIndicator={false}
        bounces={false}
      >
        <View style={styles.splashInner} onLayout={revealAppSplash}>
          <View style={styles.header}>
            <Text
              style={[
                styles.title,
                { color: SPLASH_TITLE_COLOR, fontSize: titleFontSize, lineHeight: titleFontSize + 4 },
              ]}
            >
              Bobble
            </Text>
            <Text
              style={[
                styles.subtitle,
                {
                  color: colors.textAccent,
                  fontSize: subtitleFontSize,
                  lineHeight: subtitleLineHeight,
                },
              ]}
            >
              Unwind your messy mind
            </Text>
          </View>
          <Image
            source={require('../../src/assets/images/bobble-splash.png')}
            style={{ width: heroImageWidth, height: heroImageHeight }}
            contentFit="contain"
          />
          <Image
            source={require('@/src/assets/images/bobble-splash-support.png')}
            style={{ width: heroImageWidth, height: supportImageHeight }}
            contentFit="contain"
          />
          <View style={[styles.tagline, { marginTop: Math.round(verticalGap * 0.35) }]}>
            <Text
              style={[
                styles.taglineLine,
                {
                  color: colors.textAccent,
                  fontSize: taglineFontSize,
                  lineHeight: taglineLineHeight,
                },
              ]}
            >
              Dream.{' '}
              <Text
                style={[
                  styles.taglineLine,
                  { color: '#0B0944', fontSize: taglineFontSize, lineHeight: taglineLineHeight },
                ]}
              >
                Believe.
              </Text>
            </Text>

            <Text
              style={[
                styles.taglineLine,
                {
                  color: colors.textAccent,
                  fontSize: taglineFontSize,
                  lineHeight: taglineLineHeight,
                },
              ]}
            >
              Bobble.{' '}
              <Text
                style={[
                  styles.taglineLine,
                  { color: colors.text, fontSize: taglineFontSize, lineHeight: taglineLineHeight },
                ]}
              >
                Achieve.
              </Text>
            </Text>
          </View>
        </View>
      </ScrollView>
    </OnboardingScreenLayout>
  );
}

const styles = StyleSheet.create({
  content: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  scrollBody: {
    width: '100%',
  },
  splashBody: {
    flexGrow: 1,
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
    paddingVertical: 8,
  },
  splashInner: {
    width: '100%',
    alignItems: 'center',
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
  guestLink: {
    ...Typography.caption,
    fontFamily: FontFamily.bold,
    fontSize: 16,
    paddingVertical: 8,
    textAlign: 'center',
  },
  footerText: {
    ...Typography.caption,
  },
  footerLink: {
    ...Typography.caption,
    fontWeight: '600',
  },
});
