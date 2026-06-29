import { useIsFocused } from '@react-navigation/native';
import { Image, ImageSource, ImageStyle } from 'expo-image';
import { useEffect, useRef, useState } from 'react';
import { StyleSheet } from 'react-native';

import { useBobbleColors } from '@/src/hooks/use-bobble-colors';
import { useColorScheme } from '@/src/hooks/use-color-scheme';
import { useHomeHeartIntro } from '@/src/hooks/use-home-heart-intro';

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

const ANIMATED_MASCOT_SOURCES: Partial<Record<MascotVariant, ImageSource>> = {
  voice: require('@/src/assets/images/mascot/bobble-voice-animated.webp'),
  greet: require('@/src/assets/images/mascot/bobble-greet-animated.webp'),
};

const HOME_ANIMATED_SOURCE = require('@/src/assets/images/bobble-home-tab-animated.webp');

type AnimatedMascotVariant = keyof typeof ANIMATED_MASCOT_SOURCES;

type BobbleMascotProps = {
  variant?: MascotVariant;
  size?: number;
  style?: ImageStyle;
  backgroundColor?: string;
  /** When false, shows the static frame until set true (restarts the animation). */
  playAnimation?: boolean;
};

const HOME_ASPECT_RATIO = 492 / 738;
const VOICE_ASPECT_RATIO = 860 / 730;
const GREET_ASPECT_RATIO = 860 / 696;

function getMascotDimensions(variant: MascotVariant, size: number) {
  if (variant === 'home') {
    return { width: size, height: size * HOME_ASPECT_RATIO };
  }

  if (variant === 'voice') {
    return { width: size, height: size * VOICE_ASPECT_RATIO };
  }

  if (variant === 'greet') {
    return { width: size, height: size * GREET_ASPECT_RATIO };
  }

  return { width: size, height: size };
}

function AnimatedMascotImage({
  variant,
  playAnimation,
  width,
  height,
  borderRadius,
  backgroundColor,
  style,
}: {
  variant: AnimatedMascotVariant;
  playAnimation: boolean;
  width: number;
  height: number;
  borderRadius: number;
  backgroundColor: string;
  style?: ImageStyle;
}) {
  const [replayKey, setReplayKey] = useState(0);
  const wasPlayingRef = useRef(false);

  useEffect(() => {
    if (!playAnimation) {
      wasPlayingRef.current = false;
      return;
    }

    if (!wasPlayingRef.current) {
      wasPlayingRef.current = true;
      setReplayKey((key) => key + 1);
    }
  }, [playAnimation]);

  const source = playAnimation
    ? ANIMATED_MASCOT_SOURCES[variant]!
    : MASCOT_SOURCES[variant].light;

  return (
    <Image
      key={playAnimation ? `${variant}-animated-${replayKey}` : `${variant}-static`}
      source={source}
      style={[
        styles.image,
        {
          width,
          height,
          borderRadius,
          backgroundColor,
        },
        style,
      ]}
      contentFit="contain"
      {...(playAnimation ? { useAppleWebpCodec: false } : {})}
    />
  );
}

function HomeMascotImage({
  width,
  height,
  borderRadius,
  backgroundColor,
  style,
}: {
  width: number;
  height: number;
  borderRadius: number;
  backgroundColor: string;
  style?: ImageStyle;
}) {
  const isFocused = useIsFocused();
  const { playIntro, replayKey } = useHomeHeartIntro(isFocused);
  const source = playIntro ? HOME_ANIMATED_SOURCE : MASCOT_SOURCES.home.light;

  return (
    <Image
      key={playIntro ? `home-heart-${replayKey}` : 'home-heart-static'}
      source={source}
      style={[
        styles.image,
        {
          width,
          height,
          borderRadius,
          backgroundColor,
        },
        style,
      ]}
      contentFit="contain"
      {...(playIntro ? { useAppleWebpCodec: false } : {})}
    />
  );
}

export function BobbleMascot({
  variant = 'splash',
  size = 200,
  style,
  backgroundColor: backgroundColorProp,
  playAnimation = true,
}: BobbleMascotProps) {
  const scheme = useColorScheme();
  const colors = useBobbleColors();
  const isHome = variant === 'home';
  const usesOwnBackground = isHome || variant === 'main' || variant === 'splash';
  const { width, height } = getMascotDimensions(variant, size);
  const borderRadius =
    typeof style?.borderRadius === 'number' ? style.borderRadius : isHome ? 0 : 100;
  const backgroundColor =
    backgroundColorProp ?? (usesOwnBackground ? 'transparent' : colors.background);

  if (isHome) {
    return (
      <HomeMascotImage
        width={width}
        height={height}
        borderRadius={borderRadius}
        backgroundColor={backgroundColor}
        style={style}
      />
    );
  }

  if (variant in ANIMATED_MASCOT_SOURCES) {
    return (
      <AnimatedMascotImage
        variant={variant as AnimatedMascotVariant}
        playAnimation={playAnimation}
        width={width}
        height={height}
        borderRadius={borderRadius}
        backgroundColor={backgroundColor}
        style={style}
      />
    );
  }

  return (
    <Image
      source={MASCOT_SOURCES[variant][scheme]}
      style={[
        styles.image,
        {
          width,
          height,
          borderRadius,
          backgroundColor,
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
