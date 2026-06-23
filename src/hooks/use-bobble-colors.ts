import { useMemo } from 'react';

import { useColorScheme } from '@/src/hooks/use-color-scheme';
import { getBobbleThemeColors, type BobbleThemeColors } from '@/src/theme';

export function useBobbleColors(): BobbleThemeColors {
  const scheme = useColorScheme();
  return useMemo(() => getBobbleThemeColors(scheme), [scheme]);
}
