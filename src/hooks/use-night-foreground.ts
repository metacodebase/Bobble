import { useColorScheme } from '@/src/hooks/use-color-scheme';

const NIGHT_TEXT = '#FFFFFF';
const NIGHT_TEXT_SECONDARY = 'rgba(255, 255, 255, 0.72)';

/**
 * Text colors for chrome over the night backdrop image.
 * Night/light appearance follows the resolved color scheme.
 */
export function useNightForeground() {
  const isNight = useColorScheme() === 'dark';

  return {
    isNight,
    text: isNight ? NIGHT_TEXT : undefined,
    textSecondary: isNight ? NIGHT_TEXT_SECONDARY : undefined,
  };
}
