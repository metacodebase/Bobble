import { Platform } from 'react-native';

import { BobbleColors, type BobbleThemeColors } from './colors';
import { FontFamily } from './fonts';

export { BobbleColors } from './colors';
export { FontFamily, Typography } from './fonts';
export type { BobbleThemeColors } from './colors';

/** @deprecated Use BobbleColors for new code */
export const Palette = {
  navy: '#0A1628',
  cobalt: '#1E3A8A',
  sky: '#38BDF8',
  ice: '#E0F2FE',
  mint: '#34D399',
  coral: '#F97316',
  stone: '#94A3B8',
  cream: '#F8FAFC',
  white: BobbleColors.background,
  black: BobbleColors.text,
} as const;

export const Brand = {
  primary: BobbleColors.primary,
  primaryDark: BobbleColors.primaryDark,
  primaryLight: BobbleColors.primaryLight,
  secondary: BobbleColors.success,
  surface: BobbleColors.background,
} as const;

export const Colors = {
  light: {
    text: BobbleColors.text,
    textSecondary: BobbleColors.textSecondary,
    background: BobbleColors.background,
    surface: BobbleColors.surface,
    surfaceAlt: BobbleColors.borderLight,
    surfaceCool: BobbleColors.borderLight,
    border: BobbleColors.border,
    tint: BobbleColors.primary,
    primary: BobbleColors.primary,
    primaryDark: BobbleColors.primaryDark,
    primaryLight: BobbleColors.primaryLight,
    secondary: BobbleColors.success,
    icon: BobbleColors.textSecondary,
    tabIconDefault: BobbleColors.textSecondary,
    tabIconSelected: BobbleColors.primary,
    success: BobbleColors.success,
    warning: BobbleColors.warning,
    error: BobbleColors.error,
    headerBackground: BobbleColors.primary,
    headerText: BobbleColors.textOnPrimary,
    footerLink: BobbleColors.textAccent,
  },
  dark: {
    text: '#F8FAFC',
    textSecondary: '#94A3B8',
    background: '#0A0F1A',
    surface: '#111827',
    surfaceAlt: '#0F172A',
    surfaceCool: '#0B1220',
    border: '#1E293B',
    tint: BobbleColors.primaryLight,
    primary: BobbleColors.primaryLight,
    primaryDark: BobbleColors.primary,
    primaryLight: BobbleColors.primaryMuted,
    secondary: BobbleColors.success,
    icon: '#94A3B8',
    tabIconDefault: '#64748B',
    tabIconSelected: BobbleColors.primaryLight,
    success: '#4ADE80',
    warning: BobbleColors.warning,
    error: '#F87171',
    headerBackground: BobbleColors.primaryDark,
    headerText: BobbleColors.textOnPrimary,
    footerLink: BobbleColors.primaryLight,
  },
} as const;

export type ColorScheme = 'light' | 'dark';
export type ThemeColors = typeof Colors.light;

export function getBobbleThemeColors(scheme: ColorScheme): BobbleThemeColors {
  const theme = Colors[scheme];
  return {
    primary: BobbleColors.primary,
    primaryDark: BobbleColors.primaryDark,
    primaryLight: BobbleColors.primaryLight,
    primaryMuted: BobbleColors.primaryMuted,
    background: theme.background,
    surface: theme.surface,
    text: theme.text,
    textSecondary: theme.textSecondary,
    textAccent: scheme === 'dark' ? theme.primaryLight : BobbleColors.textAccent,
    textOnPrimary: BobbleColors.textOnPrimary,
    success: theme.success,
    error: theme.error,
    warning: theme.warning,
    border: theme.border,
    borderLight: theme.surfaceAlt,
    divider: theme.border,
    dotActive: BobbleColors.dotActive,
    dotInactive: scheme === 'dark' ? theme.icon : BobbleColors.dotInactive,
    mascotPlaceholder: BobbleColors.mascotPlaceholder,
    mascotPlaceholderLight: BobbleColors.mascotPlaceholderLight,
  };
}

export const Fonts = Platform.select({
  ios: {
    sans: FontFamily.regular,
    serif: 'ui-serif',
    rounded: 'ui-rounded',
    mono: 'ui-monospace',
  },
  default: {
    sans: FontFamily.regular,
    serif: 'serif',
    rounded: 'normal',
    mono: 'monospace',
  },
  web: {
    sans: `${FontFamily.regular}, system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif`,
    serif: "Georgia, 'Times New Roman', serif",
    rounded: "'SF Pro Rounded', 'Hiragino Maru Gothic ProN', Meiryo, 'MS PGothic', sans-serif",
    mono: "SFMono-Regular, Menlo, Monaco, Consolas, 'Liberation Mono', 'Courier New', monospace",
  },
});
