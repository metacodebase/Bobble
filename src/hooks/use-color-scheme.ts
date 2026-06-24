import { Appearance, useColorScheme as useSystemColorScheme } from 'react-native';

import { useAppStore } from '@/src/store/app-store';

function resolveSystemScheme(system: 'light' | 'dark' | null | undefined): 'light' | 'dark' {
  if (system === 'dark') return 'dark';
  if (system === 'light') return 'light';
  return Appearance.getColorScheme() === 'dark' ? 'dark' : 'light';
}

export function useColorScheme(): 'light' | 'dark' {
  const themeOverride = useAppStore((s) => s.themeOverride);
  const system = useSystemColorScheme();
  if (themeOverride) return themeOverride;
  return resolveSystemScheme(system);
}
