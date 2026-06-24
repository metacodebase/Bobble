import { ReactNode } from 'react';
import { StyleSheet, View, ViewStyle } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { useBobbleColors } from '@/src/hooks/use-bobble-colors';

export const ONBOARDING_MASCOT_SIZE = 1000 * 0.4;

type OnboardingScreenLayoutProps = {
  children: ReactNode;
  footer?: ReactNode;
  contentStyle?: ViewStyle;
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
}: OnboardingScreenLayoutProps) {
  const insets = useSafeAreaInsets();
  const colors = useBobbleColors();

  return (
    <View
      style={[
        styles.root,
        {
          backgroundColor: colors.background,
          paddingTop: insets.top + 16,
          paddingBottom: insets.bottom + 24,
        },
      ]}
    >
      <View style={[styles.content, contentStyle]}>{children}</View>
      {footer ? <View style={styles.footer}>{footer}</View> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
  },
  content: {
    flex: 1,
  },
  footer: {
    gap: 20,
    paddingTop: 16,
  },
  heroSlot: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: ONBOARDING_MASCOT_SIZE,
  },
});
