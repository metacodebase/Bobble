import { ReactNode } from 'react';
import { ImageBackground, StyleSheet, View } from 'react-native';

import { useBobbleColors } from '@/src/hooks/use-bobble-colors';
import { useColorScheme } from '@/src/hooks/use-color-scheme';
import { DEFAULT_APP_BACKGROUND } from '@/src/theme/backgrounds';

type AppBackgroundProps = {
  children: ReactNode;
};

/** App-wide default background. Light mode uses the pastel image; dark mode stays solid. */
export function AppBackground({ children }: AppBackgroundProps) {
  const colorScheme = useColorScheme();
  const colors = useBobbleColors();

  if (colorScheme === 'dark') {
    return <View style={[styles.root, { backgroundColor: colors.background }]}>{children}</View>;
  }

  return (
    <ImageBackground source={DEFAULT_APP_BACKGROUND} style={styles.root} resizeMode="cover">
      {children}
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
  },
});
