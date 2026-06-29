import { StyleSheet, Text, View } from 'react-native';

import { BobbleMascot } from '@/src/components/onboarding/bobble-mascot';
import {
  SettingsScreenLayout,
  SettingsSection,
} from '@/src/components/settings/settings-screen-layout';
import {
  ThemeOptionRow,
  type ThemePreference,
} from '@/src/components/settings/theme-option-row';
import { useBobbleColors } from '@/src/hooks/use-bobble-colors';
import { useColorScheme } from '@/src/hooks/use-color-scheme';
import { useAppStore } from '@/src/store/app-store';
import { Typography } from '@/src/theme/fonts';

const THEME_OPTIONS: { value: ThemePreference; label: string; description: string }[] = [
  {
    value: 'system',
    label: 'System Default',
    description: 'Match your device appearance',
  },
  {
    value: 'light',
    label: 'Light Mode',
    description: 'Bright backgrounds and dark text',
  },
  {
    value: 'dark',
    label: 'Dark Mode',
    description: 'Dark backgrounds and light text',
  },
];

export default function AppearanceScreen() {
  const colors = useBobbleColors();
  const activeScheme = useColorScheme();
  const themeOverride = useAppStore((s) => s.themeOverride);
  const setThemeOverride = useAppStore((s) => s.setThemeOverride);
  const selected: ThemePreference = themeOverride ?? 'system';

  const handleSelect = (value: ThemePreference) => {
    setThemeOverride(value === 'system' ? null : value);
  };

  return (
    <SettingsScreenLayout title="Appearance">
      <View style={[styles.preview, { backgroundColor: colors.borderLight, borderColor: colors.border }]}>
        <BobbleMascot variant="main" size={72} />
        <Text style={[styles.previewTitle, { color: colors.text }]}>
          {activeScheme === 'dark' ? 'Dark mode active' : 'Light mode active'}
        </Text>
        <Text style={[styles.previewBody, { color: colors.textSecondary }]}>
          Bobble adapts buttons, backgrounds, and text across the app.
        </Text>
      </View>

      <SettingsSection title="Theme">
        {THEME_OPTIONS.map((option, index) => (
          <ThemeOptionRow
            key={option.value}
            value={option.value}
            label={option.label}
            description={option.description}
            selected={selected === option.value}
            onSelect={handleSelect}
            isLast={index === THEME_OPTIONS.length - 1}
          />
        ))}
      </SettingsSection>
    </SettingsScreenLayout>
  );
}

const styles = StyleSheet.create({
  preview: {
    alignItems: 'center',
    gap: 8,
    padding: 24,
    borderRadius: 20,
    borderWidth: StyleSheet.hairlineWidth,
  },
  previewTitle: {
    ...Typography.body,
    fontFamily: Typography.button.fontFamily,
    marginTop: 4,
  },
  previewBody: {
    ...Typography.caption,
    textAlign: 'center',
    maxWidth: 260,
  },
});
