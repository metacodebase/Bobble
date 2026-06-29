import { Image, ImageSource, ImageStyle } from 'expo-image';
import { StyleSheet } from 'react-native';

import { useBobbleColors } from '@/src/hooks/use-bobble-colors';
import { useColorScheme } from '@/src/hooks/use-color-scheme';

export type MascotVariant = 'splash' | 'sitting' | 'waving' | 'main' | 'voice' | 'greet';

const MASCOT_SOURCES: Record<MascotVariant, { light: ImageSource; dark: ImageSource }> = {
  splash: {
    light: require('@/src/assets/images/mascot/mascot-splash.png'),
    dark: require('@/src/assets/images/mascot/mascot-splash-dark.png'),
  },
  sitting: {
    light: require('@/src/assets/images/mascot/mascot-sitting.png'),
    dark: require('@/src/assets/images/mascot/mascot-sitting-dark.png'),
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
};

type BobbleMascotProps = {
  variant?: MascotVariant;
  size?: number;
  style?: ImageStyle;
};

export function BobbleMascot({ variant = 'splash', size = 200, style }: BobbleMascotProps) {
  const scheme = useColorScheme();
  const colors = useBobbleColors();
  const borderRadius = typeof style?.borderRadius === 'number' ? style.borderRadius : 100;

  return (
    <Image
      source={MASCOT_SOURCES[variant][scheme]}
      style={[
        styles.image,
        {
          width: size,
          height: size,
          borderRadius,
          backgroundColor: colors.background,
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
