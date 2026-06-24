import { StyleSheet, Text, View } from 'react-native';

import { CalendarProviderIcon } from '@/src/components/create-account/calendar-brand-icons';
import { CalendarRow } from '@/src/components/create-account/calendar-row';
import {
  SettingsScreenLayout,
  SettingsSection,
} from '@/src/components/settings/settings-screen-layout';
import { useBobbleColors } from '@/src/hooks/use-bobble-colors';
import { Typography } from '@/src/theme/fonts';

const CONNECTIONS = [
  { id: 'google', name: 'Google', provider: 'google' as const },
  { id: 'apple', name: 'Apple', provider: 'apple' as const },
  { id: 'slack', name: 'Slack', emoji: '💬' },
] as const;

export default function ConnectionsScreen() {
  const colors = useBobbleColors();

  return (
    <SettingsScreenLayout title="Connections">
      <Text style={[styles.description, { color: colors.textSecondary }]}>
        Link apps and services to share Bobbles and sync reminders.
      </Text>

      <SettingsSection>
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
