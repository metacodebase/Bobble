import { Platform } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

/** Minimum padding when the OS reports no inset (e.g. Android 3-button back nav). */
const ANDROID_MIN_BOTTOM_PADDING = 10;

/** Icon + label row above the bottom safe-area padding. */
const TAB_BAR_CONTENT_HEIGHT = Platform.select({ ios: 60, android: 58, default: 58 })!;

export function useTabBarInsets() {
  const { bottom } = useSafeAreaInsets();
  const bottomPadding = Math.max(
    bottom,
    Platform.OS === 'android' ? ANDROID_MIN_BOTTOM_PADDING : 0,
  );
  const height = TAB_BAR_CONTENT_HEIGHT + bottomPadding;

  return { bottomPadding, height };
}
