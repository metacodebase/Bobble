import { ReactNode } from 'react';
import { ImageBackground, ImageSourcePropType, Platform, StyleSheet, useWindowDimensions, View, ViewStyle } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export const ONBOARDING_MASCOT_SIZE = 1000 * 0.32;

type OnboardingScreenLayoutProps = {
  children: ReactNode;
  footer?: ReactNode;
  contentStyle?: ViewStyle;
  backgroundColor?: string;
  backgroundImage?: ImageSourcePropType;
};

type OnboardingHeroSlotProps = {
  children: ReactNode;
  style?: ViewStyle;
};

/** Reserves the same vertical space as mascot slides so mixed content stays aligned. */
export function OnboardingHeroSlot({ children, style }: OnboardingHeroSlotProps) {
  return <View style={[styles.heroSlot, style]}>{children}</View>;
}

export function OnboardingScreenLayout({
  children,
  footer,
  contentStyle,
  backgroundImage,
}: OnboardingScreenLayoutProps) {
  const insets = useSafeAreaInsets();
  const { width, height } = useWindowDimensions();
  const referenceWidth = Platform.OS === 'android' ? 412 : 390;
  const referenceHeight = Platform.OS === 'android' ? 915 : 844;
  const scale = Math.min(width / referenceWidth, height / referenceHeight);
  const topPadding = insets.top + Math.round(16 * scale);
  const androidBottomBuffer = Platform.OS === 'android' ? Math.round(14 * scale) : 0;
  const bottomPadding = insets.bottom + Math.round(20 * scale) + androidBottomBuffer;
  const footerGap = Math.round(16 * scale);

  return (
    <ImageBackground
      source={backgroundImage}
      style={{
        flex: 1,
        paddingTop: topPadding,
        paddingBottom: bottomPadding,
        width: '100%',
      }}
    >
      <View
        style={[
          {
            flex: 1,
            width: '100%',
          },
        ]}
      >
        <View style={[styles.content, contentStyle]}>{children}</View>
        {footer ? <View style={[styles.footer, { gap: footerGap }]}>{footer}</View> : null}
      </View>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  content: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'flex-start',
    width: '100%',
  },
  footer: {
    width: '80%',
    alignSelf: 'center',
  },
  heroSlot: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'flex-start',
    paddingTop: 24,
    minHeight: ONBOARDING_MASCOT_SIZE,
  },
});
