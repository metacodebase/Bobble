import { ReactNode } from 'react';
import { ImageBackground, StyleSheet } from 'react-native';

import { useAppStore } from '@/src/store/app-store';
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
  const nightBackground = useAppStore((s) => s.nightBackground);

  return {
    nightBackground,
    source: nightBackground ? NIGHT_APP_BACKGROUND : DEFAULT_APP_BACKGROUND,
    color: nightBackground
      ? NIGHT_APP_BACKGROUND_COLOR
      : DEFAULT_APP_BACKGROUND_COLOR,
  };
}

/** App-wide background. Swaps day/night image only — no theme color changes. */
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
