import { useState } from 'react';

import {
  SettingsDescription,
  SettingsScreenLayout,
  SettingsSection,
} from '@/src/components/settings/settings-screen-layout';
import { SettingsToggleRow } from '@/src/components/settings/settings-toggle-row';

export default function NotificationsScreen() {
  const [pushEnabled, setPushEnabled] = useState(true);
  const [emailEnabled, setEmailEnabled] = useState(false);
  const [remindersEnabled, setRemindersEnabled] = useState(true);
  const [streakEnabled, setStreakEnabled] = useState(true);

  return (
    <SettingsScreenLayout title="Notifications">
      <SettingsDescription>
        Choose how Bobble keeps you updated.
      </SettingsDescription>

      <SettingsSection title="Alerts">
        <SettingsToggleRow
          label="Push notifications"
          description="Task reminders."
          value={pushEnabled}
          onValueChange={setPushEnabled}
        />
        <SettingsToggleRow
          label="Email digest"
          description="Weekly summary of your Bobbles"
          value={emailEnabled}
          onValueChange={setEmailEnabled}
          isLast
        />
      </SettingsSection>

      <SettingsSection title="Reminders">
        <SettingsToggleRow
          label="Task reminders"
          description="Notify before scheduled tasks"
          value={remindersEnabled}
          onValueChange={setRemindersEnabled}
        />
        <SettingsToggleRow
          label="Streak reminders"
          description="Daily nudge to keep your streak alive"
          value={streakEnabled}
          onValueChange={setStreakEnabled}
          isLast
        />
      </SettingsSection>
    </SettingsScreenLayout>
  );
}
