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

  /** Splash tagline — "Dream, Believe. Bobble. Achieve" */
  splashTagline: {
    fontFamily: FontFamily.semiBold,
    fontSize: 16,
  },

  /** Onboarding & auth headings */
  heading: {
    fontFamily: FontFamily.bold,
    fontSize: 32,
    lineHeight: 40,
  },

  /** Auth sub-heading */
  subheading: {
    fontFamily: FontFamily.regular,
    fontSize: 18,
    lineHeight: 26,
  },

  /** Body copy, feature list items */
  body: {
    fontFamily: FontFamily.regular,
    fontSize: 16,
    lineHeight: 24,
  },

  /** Primary button label */
  button: {
    fontFamily: FontFamily.semiBold,
    fontSize: 17,
    lineHeight: 22,
  },

  /** Social login button label */
  socialButton: {
    fontFamily: FontFamily.medium,
    fontSize: 16,
    lineHeight: 22,
  },

  /** Footer links — "Sign up" */
  caption: {
    fontFamily: FontFamily.regular,
    fontSize: 14,
    lineHeight: 20,
  },

  /** Divider "or" text */
  divider: {
    fontFamily: FontFamily.regular,
    fontSize: 14,
    lineHeight: 20,
  },

  /** Form field label above inputs */
  formLabel: {
    fontFamily: FontFamily.medium,
    fontSize: 14,
    lineHeight: 20,
  },

  /** Text input value */
  input: {
    fontFamily: FontFamily.regular,
    fontSize: 16,
    lineHeight: 24,
  },
} as const;
