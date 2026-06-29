import { useColorScheme } from '@/src/hooks/use-color-scheme';
import { useAppStore } from '@/src/store/app-store';

export function useThemeToggle() {
  const isDark = useColorScheme() === 'dark';
  const setThemeOverride = useAppStore((s) => s.setThemeOverride);

  const setIsDark = (value: boolean) => {
    setThemeOverride(value ? 'dark' : 'light');
  };

  return { isDark, setIsDark };
}
