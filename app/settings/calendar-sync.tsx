import { StyleSheet, Text, View } from 'react-native';

import { CalendarProviderIcon } from '@/src/components/create-account/calendar-brand-icons';
import { CalendarRow } from '@/src/components/create-account/calendar-row';
import {
  SettingsScreenLayout,
  SettingsSection,
} from '@/src/components/settings/settings-screen-layout';
import { useBobbleColors } from '@/src/hooks/use-bobble-colors';
import { Typography } from '@/src/theme/fonts';

const CALENDARS = [
  { id: 'google', name: 'Google Calendar', provider: 'google' as const },
  { id: 'apple', name: 'Apple Calendar', provider: 'apple' as const },
  { id: 'outlook', name: 'Outlook Calendar', provider: 'outlook' as const },
] as const;

export default function CalendarSyncScreen() {
  const colors = useBobbleColors();

  return (
    <SettingsScreenLayout title="Calendar Sync">
      <Text style={[styles.description, { color: colors.textSecondary }]}>
        Connect calendars to sync tasks and events from your Bobbles.
      </Text>

      <SettingsSection>
        <View style={styles.list}>
          {CALENDARS.map((calendar) => (
            <CalendarRow
              key={calendar.id}
              name={calendar.name}
              icon={<CalendarProviderIcon provider={calendar.provider} />}
            />
          ))}
        </View>
      </SettingsSection>
    </SettingsScreenLayout>
  );
}

const styles = StyleSheet.create({
  description: {
    ...Typography.body,
    lineHeight: 22,
  },
  list: {
    paddingHorizontal: 16,
  },
});
