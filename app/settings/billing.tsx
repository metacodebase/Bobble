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
        <SettingsLinkRow label="Current plan" />
        <SettingsLinkRow label="Payment method" isLast />
      </SettingsSection>
    </SettingsScreenLayout>
  );
}
