import Constants from 'expo-constants';
import { StyleSheet, Text, View } from 'react-native';

import { BobbleMascot } from '@/src/components/onboarding/bobble-mascot';
import { SettingsLinkRow } from '@/src/components/settings/settings-link-row';
import {
  SettingsScreenLayout,
  SettingsSection,
} from '@/src/components/settings/settings-screen-layout';
import { useBobbleColors } from '@/src/hooks/use-bobble-colors';
import { Typography } from '@/src/theme/fonts';

export default function AboutScreen() {
  const colors = useBobbleColors();
  const version = Constants.expoConfig?.version ?? '1.0.0';

  return (
    <SettingsScreenLayout title="About Bobble">
      <View style={styles.hero}>
        <BobbleMascot variant="waving" size={100} />
        <Text style={[styles.appName, { color: colors.text }]}>Bobble</Text>
        <Text style={[styles.version, { color: colors.textSecondary }]}>Version {version}</Text>
        <Text style={[styles.tagline, { color: colors.textSecondary }]}>
          Capture thoughts, turn them into action.
        </Text>
      </View>

      <SettingsSection title="Legal">
        <SettingsLinkRow label="Terms of Service" />
        <SettingsLinkRow label="Privacy Policy" />
        <SettingsLinkRow label="Licenses" isLast />
      </SettingsSection>
    </SettingsScreenLayout>
  );
}

const styles = StyleSheet.create({
  hero: {
    alignItems: 'center',
    gap: 6,
    marginBottom: 8,
  },
  appName: {
    ...Typography.heading,
    fontSize: 24,
    lineHeight: 32,
    marginTop: 8,
  },
  version: {
    ...Typography.caption,
  },
  tagline: {
    ...Typography.body,
    textAlign: 'center',
    maxWidth: 260,
    marginTop: 4,
  },
});
