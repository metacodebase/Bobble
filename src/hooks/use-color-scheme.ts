import { useColorScheme as useSystemColorScheme } from 'react-native';

import { useAppStore } from '@/src/store/app-store';

/**
 * Resolved appearance for the app.
 * Prefer an explicit Settings override; otherwise follow the device scheme.
 */
export function useColorScheme(): 'light' | 'dark' {
  const themeOverride = useAppStore((s) => s.themeOverride);
  const systemScheme = useSystemColorScheme();

  if (themeOverride) return themeOverride;
  return systemScheme === 'dark' ? 'dark' : 'light';
}
