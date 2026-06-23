import { StyleSheet, Text } from 'react-native';

import { SettingsLinkRow } from '@/src/components/settings/settings-link-row';
import {
  SettingsScreenLayout,
  SettingsSection,
} from '@/src/components/settings/settings-screen-layout';
import { useBobbleColors } from '@/src/hooks/use-bobble-colors';
import { Typography } from '@/src/theme/fonts';

export default function HelpScreen() {
  const colors = useBobbleColors();

  return (
    <SettingsScreenLayout title="Help & Support">
      <Text style={[styles.description, { color: colors.textSecondary }]}>
        Get answers, report issues, or reach our team.
      </Text>

      <SettingsSection title="Support">
        <SettingsLinkRow label="FAQ" />
        <SettingsLinkRow label="Contact support" />
        <SettingsLinkRow label="Report a bug" isLast />
      </SettingsSection>

      <SettingsSection title="Guides">
        <SettingsLinkRow label="Getting started with Bobbles" />
        <SettingsLinkRow label="Syncing your calendar" isLast />
      </SettingsSection>
    </SettingsScreenLayout>
  );
}

const styles = StyleSheet.create({
  description: {
    ...Typography.body,
    lineHeight: 22,
  },
});
