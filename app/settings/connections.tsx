import { StyleSheet, Text, View } from 'react-native';

import { CalendarProviderIcon } from '@/src/components/create-account/calendar-brand-icons';
import { CalendarRow } from '@/src/components/create-account/calendar-row';
import {
  SettingsDescription,
  SettingsScreenLayout,
} from '@/src/components/settings/settings-screen-layout';

const CONNECTIONS = [
  { id: 'google', name: 'Google', provider: 'google' as const },
  { id: 'apple', name: 'Apple', provider: 'apple' as const },
  { id: 'slack', name: 'Slack', emoji: '💬' },
] as const;

export default function ConnectionsScreen() {
  return (
    <SettingsScreenLayout title="Connections">
      <SettingsDescription>
        Link apps and services to share Bobbles and sync reminders.
      </SettingsDescription>

      <View style={styles.list}>
        {CONNECTIONS.map((item) => (
          <CalendarRow
            key={item.id}
            name={item.name}
            icon={
              'provider' in item ? (
                <CalendarProviderIcon provider={item.provider} />
              ) : (
                <Text style={{ fontSize: 20 }}>{item.emoji}</Text>
              )
            }
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
