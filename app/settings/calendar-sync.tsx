import { StyleSheet, View } from 'react-native';

import { CalendarProviderIcon } from '@/src/components/create-account/calendar-brand-icons';
import { CalendarRow } from '@/src/components/create-account/calendar-row';
import {
  SettingsDescription,
  SettingsScreenLayout,
} from '@/src/components/settings/settings-screen-layout';

const CALENDARS = [
  { id: 'google', name: 'Google Calendar', provider: 'google' as const },
  { id: 'apple', name: 'Apple Calendar', provider: 'apple' as const },
  { id: 'outlook', name: 'Outlook Calendar', provider: 'outlook' as const },
] as const;

export default function CalendarSyncScreen() {
  return (
    <SettingsScreenLayout title="Calendar Sync">
      <SettingsDescription>
        Connect calendars to sync tasks and events from your Bobbles.
      </SettingsDescription>

      <View style={styles.list}>
        {CALENDARS.map((calendar) => (
          <CalendarRow
            key={calendar.id}
            name={calendar.name}
            icon={<CalendarProviderIcon provider={calendar.provider} />}
          />
        ))}
      </View>
    </SettingsScreenLayout>
  );
}

const styles = StyleSheet.create({
  list: {
    gap: 12,
  },
});
