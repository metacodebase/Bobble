import { useAppStore } from '@/src/store/app-store';

export function useColorScheme(): 'light' | 'dark' {
  const themeOverride = useAppStore((s) => s.themeOverride);
  if (themeOverride) return themeOverride;
  return 'light';
}
