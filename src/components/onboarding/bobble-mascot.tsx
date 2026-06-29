import { Image, ImageSource, ImageStyle } from 'expo-image';
import { StyleSheet } from 'react-native';

import { useBobbleColors } from '@/src/hooks/use-bobble-colors';
import { useColorScheme } from '@/src/hooks/use-color-scheme';

export type MascotVariant = 'splash' | 'waving' | 'main' | 'voice' | 'greet' | 'home';

const MASCOT_SOURCES: Record<MascotVariant, { light: ImageSource; dark: ImageSource }> = {
  splash: {
    light: require('@/src/assets/images/bobble-main.png'),
    dark: require('@/src/assets/images/bobble-main.png'),
  },
  waving: {
    light: require('@/src/assets/images/mascot/mascot-waving.png'),
    dark: require('@/src/assets/images/mascot/mascot-waving-dark.png'),
  },
  main: {
    light: require('@/src/assets/images/bobble-main.png'),
    dark: require('@/src/assets/images/bobble-main.png'),
  },
  voice: {
    light: require('@/src/assets/images/mascot/bobble-voice.png'),
    dark: require('@/src/assets/images/mascot/bobble-voice.png'),
  },
  greet: {
    light: require('@/src/assets/images/mascot/bobble-greet.png'),
    dark: require('@/src/assets/images/mascot/bobble-greet.png'),
  },
  home: {
    light: require('@/src/assets/images/bobble-home-tab.png'),
    dark: require('@/src/assets/images/bobble-home-tab.png'),
  },
};

type BobbleMascotProps = {
  variant?: MascotVariant;
  size?: number;
  style?: ImageStyle;
};

const HOME_ASPECT_RATIO = 492 / 738;

export function BobbleMascot({ variant = 'splash', size = 200, style }: BobbleMascotProps) {
  const scheme = useColorScheme();
  const colors = useBobbleColors();
  const isHome = variant === 'home';
  const usesOwnBackground = isHome || variant === 'main' || variant === 'splash';
  const width = size;
  const height = isHome ? size * HOME_ASPECT_RATIO : size;
  const borderRadius =
    typeof style?.borderRadius === 'number' ? style.borderRadius : isHome ? 0 : 100;

  return (
    <Image
      source={MASCOT_SOURCES[variant][scheme]}
      style={[
        styles.image,
        {
          width,
          height,
          borderRadius,
          backgroundColor: usesOwnBackground ? 'transparent' : colors.background,
        },
        style,
      ]}
      contentFit="contain"
    />
  );
}

const styles = StyleSheet.create({
  image: {
    alignSelf: 'center',
  },
});
