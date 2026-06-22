import { Image, ImageSource, ImageStyle } from 'expo-image';
import { StyleSheet } from 'react-native';

export type MascotVariant = 'splash' | 'sitting' | 'waving';

const MASCOT_SOURCES: Record<MascotVariant, ImageSource> = {
  splash: require('@/src/assets/images/mascot/mascot-splash.png'),
  sitting: require('@/src/assets/images/mascot/mascot-sitting.png'),
  waving: require('@/src/assets/images/mascot/mascot-waving.png'),
};

type BobbleMascotProps = {
  variant?: MascotVariant;
  size?: number;
  style?: ImageStyle;
};

export function BobbleMascot({ variant = 'splash', size = 200, style }: BobbleMascotProps) {
  return (
    <Image
      source={MASCOT_SOURCES[variant]}
      style={[styles.image, { width: size, height: size }, style]}
      contentFit="cover"
    />
  );
}

const styles = StyleSheet.create({
  image: {
    alignSelf: 'center',
  },
});
