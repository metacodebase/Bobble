import { ReactNode } from 'react';
import { StyleSheet, View, ViewStyle } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { BobbleColors } from '@/src/theme/colors';

type OnboardingScreenLayoutProps = {
  children: ReactNode;
  footer?: ReactNode;
  contentStyle?: ViewStyle;
};

export function OnboardingScreenLayout({
  children,
  footer,
  contentStyle,
}: OnboardingScreenLayoutProps) {
  const insets = useSafeAreaInsets();

  return (
    <View style={[styles.root, { paddingTop: insets.top + 16, paddingBottom: insets.bottom + 24 }]}>
      <View style={[styles.content, contentStyle]}>{children}</View>
      {footer ? <View style={styles.footer}>{footer}</View> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: BobbleColors.background,
    // paddingHorizontal: 28,
  },
  content: {
    flex: 1,
  },
  footer: {
    gap: 20,
    paddingTop: 16,
  },
});
