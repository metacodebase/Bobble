import { SettingsLinkRow } from '@/src/components/settings/settings-link-row';
import {
  SettingsDescription,
  SettingsScreenLayout,
  SettingsSection,
} from '@/src/components/settings/settings-screen-layout';
import { BUG_REPORT_EMAIL, openEmail, SUPPORT_CONTACT_EMAIL } from '@/src/utils/support-email';
import { toast } from '@/src/utils/toast';

async function handleEmail(to: string, subject: string) {
  try {
    await openEmail(to, subject);
  } catch {
    toast.error('Could not open your email app');
  }
}

export default function HelpScreen() {
  return (
    <SettingsScreenLayout title="Help & Support">
      <SettingsDescription>
        Get answers, report issues, or reach our team.
      </SettingsDescription>

      <SettingsSection title="Support">
        <SettingsLinkRow label="FAQ" />
        <SettingsLinkRow
          label="Contact support"
          onPress={() => void handleEmail(SUPPORT_CONTACT_EMAIL, 'Bobble support request')}
        />
        <SettingsLinkRow
          label="Report a bug"
          onPress={() => void handleEmail(BUG_REPORT_EMAIL, 'Bobble bug report')}
          isLast
        />
      </SettingsSection>

      <SettingsSection title="Guides">
        <SettingsLinkRow label="Getting started with Bobbles" isLast />
      </SettingsSection>
    </SettingsScreenLayout>
  );
}
