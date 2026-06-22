import { Platform } from 'react-native';

/**
 * Bobble typography tokens.
 * Inter is loaded via expo-font in the auth flow; fall back to system sans-serif.
 */
export const FontFamily = {
  regular: 'Inter_400Regular',
  medium: 'Inter_500Medium',
  semiBold: 'Inter_600SemiBold',
  bold: 'Inter_700Bold',
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
    fontFamily: FontFamily.bold,
    fontSize: 40,
    lineHeight: 48,
  },

  /** Splash tagline — "unwind a messy mind" */
  splashTagline: {
    fontFamily: FontFamily.regular,
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
} as const;
