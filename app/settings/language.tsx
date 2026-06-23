import { Pressable, StyleSheet, Text, View } from 'react-native';

import {
  SettingsScreenLayout,
  SettingsSection,
} from '@/src/components/settings/settings-screen-layout';
import { useBobbleColors } from '@/src/hooks/use-bobble-colors';
import { Typography } from '@/src/theme/fonts';

const LANGUAGES = [
  { id: 'en', label: 'English', native: 'English' },
  { id: 'es', label: 'Spanish', native: 'Español' },
  { id: 'fr', label: 'French', native: 'Français' },
  { id: 'de', label: 'German', native: 'Deutsch' },
] as const;

export default function LanguageScreen() {
  const colors = useBobbleColors();
  const selected = 'en';

  return (
    <SettingsScreenLayout title="Language">
      <SettingsSection>
        {LANGUAGES.map((language, index) => {
          const active = language.id === selected;
          const isLast = index === LANGUAGES.length - 1;
          return (
            <Pressable
              key={language.id}
              style={({ pressed }) => [
                styles.row,
                !isLast && { borderBottomWidth: StyleSheet.hairlineWidth, borderBottomColor: colors.border },
                pressed && styles.pressed,
              ]}
            >
              <View>
                <Text style={[styles.label, { color: colors.text }]}>{language.label}</Text>
                <Text style={[styles.native, { color: colors.textSecondary }]}>{language.native}</Text>
              </View>
              {active ? (
                <View style={[styles.badge, { backgroundColor: colors.primary }]}>
                  <Text style={[styles.badgeText, { color: colors.textOnPrimary }]}>Active</Text>
                </View>
              ) : null}
            </Pressable>
          );
        })}
      </SettingsSection>
    </SettingsScreenLayout>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 14,
  },
  pressed: {
    opacity: 0.85,
  },
  label: {
    ...Typography.body,
    fontFamily: Typography.button.fontFamily,
  },
  native: {
    ...Typography.caption,
    marginTop: 2,
  },
  badge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  badgeText: {
    ...Typography.caption,
    fontFamily: Typography.button.fontFamily,
  },
});
