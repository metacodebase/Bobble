import { ReactNode } from 'react';
import { ImageBackground, ImageSourcePropType, StyleSheet, View, ViewStyle } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { useBobbleColors } from '@/src/hooks/use-bobble-colors';

export const ONBOARDING_MASCOT_SIZE = 1000 * 0.4;

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
  backgroundColor,
  backgroundImage,
}: OnboardingScreenLayoutProps) {
  const insets = useSafeAreaInsets();
  const colors = useBobbleColors();

  return (
    <ImageBackground source={backgroundImage} style={{
      flex: 1, paddingVertical: 40, width: "100%"
    }}>
      <View
        style={[
          {
            flex: 1,
            width: '100%',
          },
        ]}
      >
        <View style={[styles.content, contentStyle]}>{children}</View>
        {footer ? <View style={styles.footer}>{footer}</View> : null}
      </View>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  content: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
  },
  footer: {
    gap: 20,
    width: '90%',
    alignSelf: 'center',
  },
  heroSlot: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: ONBOARDING_MASCOT_SIZE,
  },
});
