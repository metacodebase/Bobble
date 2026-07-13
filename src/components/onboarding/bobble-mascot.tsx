import { Image, ImageSource, ImageStyle } from 'expo-image';
import { useEffect, useRef, useState } from 'react';
import { StyleSheet, View } from 'react-native';
import Animated, {
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';

import { useBobbleColors } from '@/src/hooks/use-bobble-colors';
import { useColorScheme } from '@/src/hooks/use-color-scheme';

export type MascotVariant = 'splash' | 'main' | 'voice' | 'features' | 'greet' | 'home';

const MASCOT_SOURCES: Record<MascotVariant, { light: ImageSource; dark: ImageSource }> = {
  splash: {
    light: require('@/src/assets/images/bobble-main.png'),
    dark: require('@/src/assets/images/bobble-main.png'),
  },
  main: {
    light: require('@/src/assets/images/bobble-main.png'),
    dark: require('@/src/assets/images/bobble-main.png'),
  },
  voice: {
    light: require('@/src/assets/images/mascot/bobble-voice.png'),
    dark: require('@/src/assets/images/mascot/bobble-voice.png'),
  },
  features: {
    light: require('@/src/assets/images/mascot/bobble-features.png'),
    dark: require('@/src/assets/images/mascot/bobble-features.png'),
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
  voice: require('@/src/assets/images/mascot/bobble-voice.png'),
  greet: require('@/src/assets/images/mascot/bobble-greet.png'),
};

const HOME_ANIMATED_SOURCE = require('@/src/assets/images/bobble-home-tab-animated.webp');
const HOME_NERDY_SOURCE = require('@/src/assets/images/bobble-nerdy-home.png');
const HOME_COMPLETE_SOURCE = require('@/src/assets/images/bobble-cloud-home.png');

export type HomeVariant = 'default' | 'nerdy' | 'complete';
type AnimatedMascotVariant = keyof typeof ANIMATED_MASCOT_SOURCES;

type BobbleMascotProps = {
  variant?: MascotVariant;
  size?: number;
  style?: ImageStyle;
  backgroundColor?: string;
  /** When false, shows the static frame until set true (restarts the animation). */
  playAnimation?: boolean;
  /** Home tab mascot style — reacts to today's task progress. */
  homeVariant?: HomeVariant;
};

const HOME_ASPECT_RATIO = 492 / 738;
const VOICE_ASPECT_RATIO = 860 / 730;
const FEATURES_ASPECT_RATIO = 743 / 1024;
const GREET_ASPECT_RATIO = 860 / 696;

export function getFeaturesMascotWidth(maxHeight: number) {
  return maxHeight / FEATURES_ASPECT_RATIO;
}

function getMascotDimensions(variant: MascotVariant, size: number) {
  if (variant === 'home') {
    return { width: size, height: size * HOME_ASPECT_RATIO };
  }

  if (variant === 'voice') {
    return { width: size, height: size * VOICE_ASPECT_RATIO };
  }

  if (variant === 'features') {
    return { width: size, height: size * FEATURES_ASPECT_RATIO };
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

const HOME_NERDY_SCALE = 0.82;
const HOME_TRANSITION_MS = 320;

const HOME_VARIANT_SCALE: Record<HomeVariant, number> = {
  default: 1,
  nerdy: HOME_NERDY_SCALE,
  complete: 1,
};

function HomeMascotImage({
  width,
  height,
  borderRadius,
  backgroundColor,
  style,
  homeVariant = 'default',
}: {
  width: number;
  height: number;
  borderRadius: number;
  backgroundColor: string;
  style?: ImageStyle;
  homeVariant?: HomeVariant;
}) {
  const scale = useSharedValue(HOME_VARIANT_SCALE[homeVariant]);
  const defaultOpacity = useSharedValue(homeVariant === 'default' ? 1 : 0);
  const nerdyOpacity = useSharedValue(homeVariant === 'nerdy' ? 1 : 0);
  const completeOpacity = useSharedValue(homeVariant === 'complete' ? 1 : 0);

  useEffect(() => {
    const timing = {
      duration: HOME_TRANSITION_MS,
      easing: Easing.out(Easing.cubic),
    };
    scale.value = withTiming(HOME_VARIANT_SCALE[homeVariant], timing);
    defaultOpacity.value = withTiming(homeVariant === 'default' ? 1 : 0, timing);
    nerdyOpacity.value = withTiming(homeVariant === 'nerdy' ? 1 : 0, timing);
    completeOpacity.value = withTiming(homeVariant === 'complete' ? 1 : 0, timing);
  }, [completeOpacity, defaultOpacity, homeVariant, nerdyOpacity, scale]);

  const scaledStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  const defaultImageStyle = useAnimatedStyle(() => ({
    opacity: defaultOpacity.value,
  }));

  const nerdyImageStyle = useAnimatedStyle(() => ({
    opacity: nerdyOpacity.value,
  }));

  const completeImageStyle = useAnimatedStyle(() => ({
    opacity: completeOpacity.value,
  }));

  const imageBaseStyle = {
    width,
    height,
    borderRadius,
    backgroundColor,
  };

  return (
    <View style={[styles.homeContainer, { width, height }, style]}>
      <Animated.View style={[styles.homeScaledWrap, scaledStyle]}>
        <Animated.View style={[styles.homeImageLayer, defaultImageStyle]}>
          <Image
            source={MASCOT_SOURCES.home.light}
            style={[styles.image, imageBaseStyle]}
            contentFit="contain"
          />
        </Animated.View>
        <Animated.View style={[styles.homeImageLayer, nerdyImageStyle]}>
          <Image
            source={HOME_NERDY_SOURCE}
            style={[styles.image, imageBaseStyle]}
            contentFit="contain"
          />
        </Animated.View>
        <Animated.View style={[styles.homeImageLayer, completeImageStyle]}>
          <Image
            source={HOME_COMPLETE_SOURCE}
            style={[styles.image, imageBaseStyle]}
            contentFit="contain"
          />
        </Animated.View>
      </Animated.View>
    </View>
  );
}

export function BobbleMascot({
  variant = 'splash',
  size = 200,
  style,
  backgroundColor: backgroundColorProp,
  playAnimation = true,
  homeVariant = 'default',
}: BobbleMascotProps) {
  const scheme = useColorScheme();
  const colors = useBobbleColors();
  const isHome = variant === 'home';
  const usesOwnBackground =
    isHome ||
    variant === 'main' ||
    variant === 'splash' ||
    variant === 'features' ||
    variant === 'voice' ||
    variant === 'greet';
  const { width, height } = getMascotDimensions(variant, size);
  const borderRadius =
    typeof style?.borderRadius === 'number'
      ? style.borderRadius
      : isHome || variant === 'features' || variant === 'voice' || variant === 'greet'
        ? 0
        : 100;
  const backgroundColor = backgroundColorProp ?? (usesOwnBackground ? 'transparent' : colors.background);

  if (isHome) {
    return (
      <HomeMascotImage
        width={width}
        height={height}
        borderRadius={borderRadius}
        backgroundColor={backgroundColor}
        style={style}
        homeVariant={homeVariant}
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
      contentFit={variant === 'features' ? 'contain' : 'cover'}
    />
  );
}

const styles = StyleSheet.create({
  image: {
    alignSelf: 'center',
  },
  homeContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },
  homeScaledWrap: {
    width: '100%',
    height: '100%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  homeImageLayer: {
    ...StyleSheet.absoluteFillObject,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
