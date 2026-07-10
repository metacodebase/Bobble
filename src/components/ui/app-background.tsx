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

/** App-wide background. Swaps day/night image only — no theme color changes. */
export function AppBackground({ children }: AppBackgroundProps) {
  const nightBackground = useAppStore((s) => s.nightBackground);

  return (
    <ImageBackground
      source={nightBackground ? NIGHT_APP_BACKGROUND : DEFAULT_APP_BACKGROUND}
      style={[
        styles.root,
        {
          backgroundColor: nightBackground
            ? NIGHT_APP_BACKGROUND_COLOR
            : DEFAULT_APP_BACKGROUND_COLOR,
        },
      ]}
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
