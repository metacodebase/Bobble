import { useAppStore } from '@/src/store/app-store';

const NIGHT_TEXT = '#FFFFFF';
const NIGHT_TEXT_SECONDARY = 'rgba(255, 255, 255, 0.72)';

/** Text colors for screens over the night background image (day/night toggle). */
export function useNightForeground() {
  const isNight = useAppStore((s) => s.nightBackground);

  return {
    isNight,
    text: isNight ? NIGHT_TEXT : undefined,
    textSecondary: isNight ? NIGHT_TEXT_SECONDARY : undefined,
  };
}
