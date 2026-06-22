/**
 * Bobble brand color palette.
 * Use these tokens across the entire app for consistent styling.
 */
export const BobbleColors = {
  /** Vibrant violet — buttons, mascot, accent text */
  primary: '#7C5CFF',
  primaryDark: '#6B4FE0',
  primaryLight: '#9B85FF',
  primaryMuted: '#B8A8FF',

  /** Surfaces */
  background: '#FFFFFF',
  surface: '#FFFFFF',

  /** Text */
  text: '#000000',
  textSecondary: '#6B7280',
  textAccent: '#7C5CFF',
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
  dotActive: '#7C5CFF',
  dotInactive: '#D1D5DB',

  /** Mascot placeholder */
  mascotPlaceholder: '#7C5CFF',
  mascotPlaceholderLight: '#C4B5FD',
} as const;

export type BobbleColor = (typeof BobbleColors)[keyof typeof BobbleColors];
