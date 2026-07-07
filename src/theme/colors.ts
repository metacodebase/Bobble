/**
 * Bobble brand color palette.
 * Use these tokens across the entire app for consistent styling.
 */
export const BobbleColors = {
  /** Vibrant violet — buttons, mascot, accent text */
  primary: '#9F52F2',
  primaryDark: '#8642D6',
  primaryLight: '#B574F5',
  primaryMuted: '#C99AF8',

  /** Surfaces */
  background: '#FFFFFF',
  surface: '#FFFFFF',

  /** Text */
  text: '#000000',
  textSecondary: '#6B7280',
  textAccent: '#9F52F2',
  textOnPrimary: '#FFFFFF',

  /** Semantic */
  success: '#22C55E',
  error: '#EF4444',
  warning: '#F59E0B',

  /** Borders & dividers */
  border: '#E5E7EB',
  borderLight: '#F3F4F6',
  divider: '#E5E7EB',

  /** Pagination */
  dotActive: '#9F52F2',
  dotInactive: '#D1D5DB',

  /** Mascot placeholder */
  mascotPlaceholder: '#9F52F2',
  mascotPlaceholderLight: '#D4B0FA',
} as const;

export type BobbleColor = (typeof BobbleColors)[keyof typeof BobbleColors];

/** Theme-aware palette — brand accents stay fixed; surfaces/text follow light/dark. */
export type BobbleThemeColors = {
  [K in keyof typeof BobbleColors]: string;
};
