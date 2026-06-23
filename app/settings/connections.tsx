import { StyleSheet, Text, View } from 'react-native';

import { AppleIcon, GoogleIcon } from '@/src/components/onboarding/social-icons';
import { CalendarRow } from '@/src/components/create-account/calendar-row';
import {
  SettingsScreenLayout,
  SettingsSection,
} from '@/src/components/settings/settings-screen-layout';
import { useBobbleColors } from '@/src/hooks/use-bobble-colors';
import { Typography } from '@/src/theme/fonts';

const CONNECTIONS = [
  { id: 'google', name: 'Google', icon: <GoogleIcon size={24} /> },
  { id: 'apple', name: 'Apple', icon: <AppleIcon size={24} /> },
  { id: 'slack', name: 'Slack', icon: <Text style={{ fontSize: 20 }}>💬</Text> },
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
            <CalendarRow key={item.id} name={item.name} icon={item.icon} />
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
