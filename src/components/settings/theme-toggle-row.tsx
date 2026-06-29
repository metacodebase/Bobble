import { Moon } from 'lucide-react-native';

import { SettingsToggleItemRow } from '@/src/components/settings/settings-item-row';
import { useBobbleColors } from '@/src/hooks/use-bobble-colors';
import { useThemeToggle } from '@/src/hooks/use-theme-toggle';

type ThemeToggleRowProps = {
  isLast?: boolean;
};

export function ThemeToggleRow({ isLast }: ThemeToggleRowProps) {
  const colors = useBobbleColors();
  const { isDark, setIsDark } = useThemeToggle();

  return (
    <SettingsToggleItemRow
      label="Dark Mode"
      icon={<Moon size={22} color={colors.primary} strokeWidth={2} />}
      value={isDark}
      onValueChange={setIsDark}
      isLast={isLast}
    />
  );
}
