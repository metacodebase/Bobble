import { StyleSheet, Text, View } from 'react-native';

import { OutlookIcon } from '@/src/components/create-account/calendar-brand-icons';
import { CalendarRow } from '@/src/components/create-account/calendar-row';
import { AppleIcon, GoogleIcon } from '@/src/components/onboarding/social-icons';
import {
  SettingsScreenLayout,
  SettingsSection,
} from '@/src/components/settings/settings-screen-layout';
import { useBobbleColors } from '@/src/hooks/use-bobble-colors';
import { Typography } from '@/src/theme/fonts';

const CALENDARS = [
  { id: 'google', name: 'Google Calendar', icon: <GoogleIcon size={24} /> },
  { id: 'apple', name: 'Apple Calendar', icon: <AppleIcon size={24} /> },
  { id: 'outlook', name: 'Outlook Calendar', icon: <OutlookIcon size={24} /> },
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
            <CalendarRow key={calendar.id} name={calendar.name} icon={calendar.icon} />
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
