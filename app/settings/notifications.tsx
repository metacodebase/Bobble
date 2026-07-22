import { ActivityIndicator, View } from 'react-native';

import {
  SettingsDescription,
  SettingsScreenLayout,
  SettingsSection,
} from '@/src/components/settings/settings-screen-layout';
import { SettingsToggleRow } from '@/src/components/settings/settings-toggle-row';
import {
  useNotificationPreferences,
  useUpdateNotificationPreferences,
} from '@/src/hooks/use-notifications';
import type { NotificationPreferences } from '@/src/features/notifications/types';
import { useBobbleColors } from '@/src/hooks/use-bobble-colors';

export default function NotificationsScreen() {
  const colors = useBobbleColors();
  const preferences = useNotificationPreferences();
  const updatePreferences = useUpdateNotificationPreferences();

  if (preferences.isLoading || !preferences.data) {
    return (
      <SettingsScreenLayout title="Notifications">
        <View style={{ paddingVertical: 32, alignItems: 'center' }}>
          <ActivityIndicator color={colors.primary} />
        </View>
      </SettingsScreenLayout>
    );
  }

  const prefs = preferences.data;

  const update = (patch: Partial<NotificationPreferences>) => {
    if (updatePreferences.isPending) return;
    updatePreferences.mutate(patch);
  };

  return (
    <SettingsScreenLayout title="Notifications">
      <SettingsDescription>
        Choose how Bobble keeps you updated. Push alerts require a rebuilt app install and
        notification permission.
      </SettingsDescription>

      <SettingsSection title="Alerts">
        <SettingsToggleRow
          label="Push notifications"
          description="Master switch for alerts on this device."
          value={prefs.pushEnabled}
          onValueChange={(pushEnabled) => update({ pushEnabled })}
        />
        <SettingsToggleRow
          label="Email digest"
          description="Weekly summary of your Bobbles (coming soon)."
          value={prefs.emailDigest}
          onValueChange={(emailDigest) => update({ emailDigest })}
          isLast
        />
      </SettingsSection>

      <SettingsSection title="Reminders">
        <SettingsToggleRow
          label="Task reminders"
          description="Notify when a scheduled task reminder is due."
          value={prefs.taskReminders}
          onValueChange={(taskReminders) => update({ taskReminders })}
          disabled={!prefs.pushEnabled}
        />
        <SettingsToggleRow
          label="Streak reminders"
          description="Daily nudge to keep your streak alive."
          value={prefs.streakReminders}
          onValueChange={(streakReminders) => update({ streakReminders })}
          disabled={!prefs.pushEnabled}
          isLast
        />
      </SettingsSection>
    </SettingsScreenLayout>
  );
}
