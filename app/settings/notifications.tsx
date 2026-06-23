import { useState } from 'react';
import { StyleSheet, Text } from 'react-native';

import {
  SettingsScreenLayout,
  SettingsSection,
} from '@/src/components/settings/settings-screen-layout';
import { SettingsToggleRow } from '@/src/components/settings/settings-toggle-row';
import { useBobbleColors } from '@/src/hooks/use-bobble-colors';
import { Typography } from '@/src/theme/fonts';

export default function NotificationsScreen() {
  const colors = useBobbleColors();
  const [pushEnabled, setPushEnabled] = useState(true);
  const [emailEnabled, setEmailEnabled] = useState(false);
  const [remindersEnabled, setRemindersEnabled] = useState(true);
  const [streakEnabled, setStreakEnabled] = useState(true);

  return (
    <SettingsScreenLayout title="Notifications">
      <Text style={[styles.description, { color: colors.textSecondary }]}>
        Choose how Bobble keeps you updated on tasks, streaks, and new insights.
      </Text>

      <SettingsSection title="Alerts">
        <SettingsToggleRow
          label="Push notifications"
          description="Task reminders and streak updates"
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

const styles = StyleSheet.create({
  description: {
    ...Typography.body,
    lineHeight: 22,
  },
});
