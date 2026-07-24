import { Href, router } from 'expo-router';

import { SettingsLinkRow } from '@/src/components/settings/settings-link-row';
import {
  SettingsDescription,
  SettingsScreenLayout,
  SettingsSection,
} from '@/src/components/settings/settings-screen-layout';

export default function BillingScreen() {
  return (
    <SettingsScreenLayout title="Billing">
      <SettingsDescription>Manage your subscription and payment methods.</SettingsDescription>

      <SettingsSection title="Subscription">
        <SettingsLinkRow
          label="Upgrade to Bobble Pro"
          onPress={() => router.push('/paywall' as Href)}
        />
        <SettingsLinkRow label="Current plan" value="Free" />
        <SettingsLinkRow label="Payment method" isLast />
      </SettingsSection>
    </SettingsScreenLayout>
  );
}
