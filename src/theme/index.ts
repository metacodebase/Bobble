import { Platform } from 'react-native';

export const Palette = {
  navy: '#0A1628',
  cobalt: '#1E3A8A',
  sky: '#38BDF8',
  ice: '#E0F2FE',
  mint: '#34D399',
  coral: '#F97316',
  stone: '#94A3B8',
  cream: '#F8FAFC',
  white: '#FFFFFF',
  black: '#000000',
} as const;

export const Brand = {
  primary: Palette.cobalt,
  primaryDark: '#172554',
  primaryLight: Palette.sky,
  secondary: Palette.mint,
  surface: Palette.cream,
} as const;

export const Colors = {
  light: {
    text: '#0F172A',
    textSecondary: '#64748B',
    background: Palette.white,
    surface: Palette.cream,
    surfaceAlt: Palette.ice,
    surfaceCool: '#F1F5F9',
    border: '#E2E8F0',
    tint: Brand.primary,
    primary: Brand.primary,
    primaryDark: Brand.primaryDark,
    primaryLight: Brand.primaryLight,
    secondary: Brand.secondary,
    icon: Palette.stone,
    tabIconDefault: '#94A3B8',
    tabIconSelected: Brand.primary,
    success: '#16A34A',
    warning: Palette.coral,
    error: '#DC2626',
    headerBackground: Palette.navy,
    headerText: Palette.white,
    footerLink: Brand.primary,
  },
  dark: {
    text: '#F8FAFC',
    textSecondary: '#94A3B8',
    background: '#0A0F1A',
    surface: '#111827',
    surfaceAlt: '#0F172A',
    surfaceCool: '#0B1220',
    border: '#1E293B',
    tint: Palette.sky,
    primary: Palette.sky,
    primaryDark: Brand.primary,
    primaryLight: '#BAE6FD',
    secondary: Palette.mint,
    icon: '#94A3B8',
    tabIconDefault: '#64748B',
    tabIconSelected: Palette.sky,
    success: '#4ADE80',
    warning: Palette.coral,
    error: '#F87171',
    headerBackground: Palette.navy,
    headerText: Palette.white,
    footerLink: Palette.sky,
  },
} as const;

export type ColorScheme = 'light' | 'dark';
export type ThemeColors = typeof Colors.light;

export const Fonts = Platform.select({
  ios: {
    sans: 'system-ui',
    serif: 'ui-serif',
    rounded: 'ui-rounded',
    mono: 'ui-monospace',
  },
  default: {
    sans: 'normal',
    serif: 'serif',
    rounded: 'normal',
    mono: 'monospace',
  },
  web: {
    sans: "system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif",
    serif: "Georgia, 'Times New Roman', serif",
    rounded: "'SF Pro Rounded', 'Hiragino Maru Gothic ProN', Meiryo, 'MS PGothic', sans-serif",
    mono: "SFMono-Regular, Menlo, Monaco, Consolas, 'Liberation Mono', 'Courier New', monospace",
  },
});
