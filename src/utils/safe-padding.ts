import { Platform, StatusBar } from 'react-native';

/** Fallback when Android reports 0 top inset (common with translucent status bars). */
const ANDROID_MIN_TOP = StatusBar.currentHeight ?? 24;

/** Fallback when Android reports 0 bottom inset (3-button / gesture nav). */
const ANDROID_MIN_BOTTOM = 16;

/**
 * On Android, ensure we always clear the status bar / cutout.
 * iOS returns the inset unchanged (callers already compose with SafeArea).
 */
export function androidSafeTop(insetsTop: number): number {
  if (Platform.OS !== 'android') return insetsTop;
  return Math.max(insetsTop, ANDROID_MIN_TOP);
}

/**
 * On Android, ensure we always clear the system navigation / gesture bar.
 */
export function androidSafeBottom(insetsBottom: number, min = ANDROID_MIN_BOTTOM): number {
  if (Platform.OS !== 'android') return insetsBottom;
  return Math.max(insetsBottom, min);
}
