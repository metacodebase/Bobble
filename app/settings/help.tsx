import { SettingsLinkRow } from '@/src/components/settings/settings-link-row';
import {
  SettingsDescription,
  SettingsScreenLayout,
  SettingsSection,
} from '@/src/components/settings/settings-screen-layout';

export default function HelpScreen() {
  return (
    <SettingsScreenLayout title="Help & Support">
      <SettingsDescription>
        Get answers, report issues, or reach our team.
      </SettingsDescription>

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
