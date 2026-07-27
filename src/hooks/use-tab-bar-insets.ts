import { Platform } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { androidSafeBottom } from '@/src/utils/safe-padding';

/** Minimum padding when the OS reports no inset (e.g. Android 3-button back nav). */
const ANDROID_MIN_BOTTOM_PADDING = 16;

/** Icon + label row above the bottom safe-area padding (matches FloatingTabBar minHeight). */
const TAB_BAR_CONTENT_HEIGHT = Platform.select({ ios: 64, android: 64, default: 64 })!;

export function useTabBarInsets() {
  const { bottom } = useSafeAreaInsets();
  const bottomPadding = androidSafeBottom(bottom, ANDROID_MIN_BOTTOM_PADDING);
  const height = TAB_BAR_CONTENT_HEIGHT + bottomPadding;

  return { bottomPadding, height };
}
