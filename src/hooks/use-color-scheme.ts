import { useColorScheme as useSystemColorScheme } from 'react-native';

import { useAppStore } from '@/src/store/app-store';

export function useColorScheme(): 'light' | 'dark' {
  const themeOverride = useAppStore((s) => s.themeOverride);
  const system = useSystemColorScheme();
  if (themeOverride) return themeOverride;
  return system === 'dark' ? 'dark' : 'light';
}
