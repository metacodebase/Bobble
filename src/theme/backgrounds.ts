import { ImageSourcePropType } from 'react-native';

/** Default full-app screen background (pastel dreamscape). */
export const DEFAULT_APP_BACKGROUND: ImageSourcePropType = require('@/src/assets/images/background/one.png');

/** Soft fallback color matching the default background image (SystemUI / splash). */
export const DEFAULT_APP_BACKGROUND_COLOR = '#F3EEF8';

/** Night / dark-mode background used when the resolved scheme is dark. */
export const NIGHT_APP_BACKGROUND: ImageSourcePropType = require('@/src/assets/images/background/one-night.png');

/** Soft fallback color matching the night background image. */
export const NIGHT_APP_BACKGROUND_COLOR = '#3B2A6B';
