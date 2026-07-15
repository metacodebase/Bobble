import { ReactNode } from 'react';
import { ImageBackground, StyleSheet } from 'react-native';

import { useColorScheme } from '@/src/hooks/use-color-scheme';
import {
  DEFAULT_APP_BACKGROUND,
  DEFAULT_APP_BACKGROUND_COLOR,
  NIGHT_APP_BACKGROUND,
  NIGHT_APP_BACKGROUND_COLOR,
} from '@/src/theme/backgrounds';

type AppBackgroundProps = {
  children: ReactNode;
};

/** Day/night backdrop source + solid fallback color for opaque navigator scenes. */
export function useAppBackdrop() {
  const isNight = useColorScheme() === 'dark';

  return {
    nightBackground: isNight,
    source: isNight ? NIGHT_APP_BACKGROUND : DEFAULT_APP_BACKGROUND,
    color: isNight ? NIGHT_APP_BACKGROUND_COLOR : DEFAULT_APP_BACKGROUND_COLOR,
  };
}

/** App-wide background. Swaps day/night image with the resolved light/dark scheme. */
export function AppBackground({ children }: AppBackgroundProps) {
  const { source, color } = useAppBackdrop();

  return (
    <ImageBackground
      source={source}
      style={[styles.root, { backgroundColor: color }]}
      resizeMode="cover"
    >
      {children}
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
  },
});
