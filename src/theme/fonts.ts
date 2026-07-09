import { Platform } from 'react-native';

/**
 * Bobble typography tokens.
 * Sniglet and DynaPuff are loaded via expo-font in the root layout; fall back to system sans-serif.
 * Sniglet only ships Regular (400) and ExtraBold (800).
 */
export const FontFamily = {
  regular: 'Sniglet_400Regular',
  medium: 'Sniglet_400Regular',
  semiBold: 'Sniglet_400Regular',
  bold: 'Sniglet_400Regular',
  /** Heavier accent — use sparingly */
  extraBold: 'Sniglet_800ExtraBold',
  /** Splash "Bobble" title */
  dynaPuff: 'DynaPuff_400Regular',
  /** System fallback when custom fonts aren't loaded yet */
  fallback: Platform.select({
    ios: 'System',
    android: 'sans-serif',
    default: 'System',
  })!,
} as const;

export const Typography = {
  /** Splash title — "Bobble" */
  splashTitle: {
    fontFamily: FontFamily.dynaPuff,
  },

  /** Splash tagline — "Dream, believe." / "Bobble." / "Achieve." */
  splashTagline: {
    fontFamily: FontFamily.semiBold,
    fontSize: Platform.OS === 'android' ? 16 : 14,
  },

  /** Onboarding & auth headings */
  heading: {
    fontFamily: FontFamily.bold,
    fontSize: Platform.OS === 'android' ? 32 : 30,
    lineHeight: Platform.OS === 'android' ? 40 : 40,
  },

  /** Auth sub-heading */
  subheading: {
    fontFamily: FontFamily.regular,
    fontSize: Platform.OS === 'android' ? 18 : 16,
    lineHeight: 26,
  },

  /** Purple accent lines under auth headings */
  accentSubtitle: {
    fontFamily: FontFamily.regular,
    fontSize: Platform.OS === 'android' ? 22 : 20,
    lineHeight: 28,
  },

  /** Body copy, feature list items */
  body: {
    fontFamily: FontFamily.regular,
    fontSize: Platform.OS === 'android' ? 18 : 16,
    lineHeight: 28,
  },

  /** Primary button label */
  button: {
    fontFamily: FontFamily.semiBold,
    fontSize: Platform.OS === 'android' ? 18 : 16,
    lineHeight: 24,
  },

  /** Social login button label */
  socialButton: {
    fontFamily: FontFamily.medium,
    fontSize: Platform.OS === 'android' ? 18 : 16,
    lineHeight: Platform.OS === 'android' ? 24 : 22,
  },

  /** Footer links — "Sign up" */
  caption: {
    fontFamily: FontFamily.regular,
    fontSize: Platform.OS === 'android' ? 18 : 16,
    lineHeight: 24,
  },

  /** Divider "or" text */
  divider: {
    fontFamily: FontFamily.regular,
    fontSize: Platform.OS === 'android' ? 18 : 16,
    lineHeight: 24,
  },

  /** Form field label above inputs */
  formLabel: {
    fontFamily: FontFamily.medium,
    fontSize: Platform.OS === 'android' ? 18 : 16,
    lineHeight: 20,
  },

  /** Text input value */
  input: {
    fontFamily: FontFamily.regular,
    fontSize: Platform.OS === 'android' ? 18 : 16,
    lineHeight: 28,
  },
} as const;
