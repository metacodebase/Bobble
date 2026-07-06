import { StyleSheet, Text } from 'react-native';

import { SettingsLinkRow } from '@/src/components/settings/settings-link-row';
import {
  SettingsScreenLayout,
  SettingsSection,
} from '@/src/components/settings/settings-screen-layout';
import { useBobbleColors } from '@/src/hooks/use-bobble-colors';
import { Typography } from '@/src/theme/fonts';

export default function BillingScreen() {
  const colors = useBobbleColors();

  return (
    <SettingsScreenLayout title="Billing">
      <Text style={[styles.description, { color: colors.textSecondary }]}>
        Manage your subscription and payment methods.
      </Text>

      <SettingsSection title="Subscription">
        <SettingsLinkRow label="Current plan" />
        <SettingsLinkRow label="Payment method" isLast />
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
