import Constants from 'expo-constants';
import { router } from 'expo-router';
import { useState } from 'react';
import { Pressable, StyleSheet, Text } from 'react-native';
import {
  AlertCircle,
  BarChart3,
  Bell,
  FileSpreadsheet,
  FileText,
  Globe,
  HelpCircle,
  Mail,
  Mic,
  Shield,
  User,
  Zap,
} from 'lucide-react-native';

import { CalendarProviderIcon } from '@/src/components/create-account/calendar-brand-icons';
import {
  SettingsLinkItemRow,
  SettingsToggleItemRow,
} from '@/src/components/settings/settings-item-row';
import { ThemeToggleRow } from '@/src/components/settings/theme-toggle-row';
import {
  SettingsScreenLayout,
  SettingsSection,
} from '@/src/components/settings/settings-screen-layout';
import { useLogout } from '@/src/hooks/api';
import { useBobbleColors } from '@/src/hooks/use-bobble-colors';
import { useAppStore } from '@/src/store/app-store';
import { Typography } from '@/src/theme/fonts';

export default function SettingsScreen() {
  const colors = useBobbleColors();
  const user = useAppStore((s) => s.user);
  const logout = useLogout();
  const version = Constants.expoConfig?.version ?? '2.4.0';
  const buildNumber =
    Constants.expoConfig?.ios?.buildNumber ??
    Constants.expoConfig?.android?.versionCode?.toString() ??
    '108';

  const [googleCalendar, setGoogleCalendar] = useState(true);
  const [appleCalendar, setAppleCalendar] = useState(false);
  const [outlookCalendar, setOutlookCalendar] = useState(false);
  const [dailyReminders, setDailyReminders] = useState(true);
  const [taskAlerts, setTaskAlerts] = useState(true);
  const [streakReminders, setStreakReminders] = useState(false);
  const [insightsWeekly, setInsightsWeekly] = useState(true);
  const [shareAnalytics, setShareAnalytics] = useState(true);
  const [personalisation, setPersonalisation] = useState(true);

  return (
    <SettingsScreenLayout title="Settings">
      <SettingsSection title="Appearance">
        <ThemeToggleRow isLast />
      </SettingsSection>

      <SettingsSection title="Calendar Sync">
        <SettingsToggleItemRow
          label="Google Calendar"
          icon={<CalendarProviderIcon provider="google" size={22} />}
          value={googleCalendar}
          onValueChange={setGoogleCalendar}
        />
        <SettingsToggleItemRow
          label="Apple Calendar"
          icon={<CalendarProviderIcon provider="apple" size={22} />}
          value={appleCalendar}
          onValueChange={setAppleCalendar}
        />
        <SettingsToggleItemRow
          label="Outlook Calendar"
          icon={<CalendarProviderIcon provider="outlook" size={22} />}
          value={outlookCalendar}
          onValueChange={setOutlookCalendar}
          isLast
        />
      </SettingsSection>

      <SettingsSection title="Notifications">
        <SettingsToggleItemRow
          label="Daily reminders"
          icon={<Bell size={22} color={colors.primary} strokeWidth={2} />}
          value={dailyReminders}
          onValueChange={setDailyReminders}
        />
        <SettingsToggleItemRow
          label="Task alerts"
          icon={<AlertCircle size={22} color={colors.primary} strokeWidth={2} />}
          value={taskAlerts}
          onValueChange={setTaskAlerts}
        />
        <SettingsToggleItemRow
          label="Streak reminders"
          icon={<Zap size={22} color={colors.primary} strokeWidth={2} />}
          value={streakReminders}
          onValueChange={setStreakReminders}
        />
        <SettingsToggleItemRow
          label="Insights weekly"
          icon={<BarChart3 size={22} color={colors.primary} strokeWidth={2} />}
          value={insightsWeekly}
          onValueChange={setInsightsWeekly}
          isLast
        />
      </SettingsSection>

      <SettingsSection title="Voice Settings">
        <SettingsLinkItemRow
          label="Language"
          icon={<Globe size={22} color={colors.primary} strokeWidth={2} />}
          value="English (US)"
          onPress={() => router.push('/settings/language')}
        />
        <SettingsLinkItemRow
          label="Recording quality"
          icon={<Mic size={22} color={colors.primary} strokeWidth={2} />}
          value="High (48kHz)"
          onPress={() => {}}
          isLast
        />
      </SettingsSection>

      <SettingsSection title="Privacy">
        <SettingsToggleItemRow
          label="Share analytics"
          icon={<Shield size={22} color={colors.primary} strokeWidth={2} />}
          value={shareAnalytics}
          onValueChange={setShareAnalytics}
        />
        <SettingsToggleItemRow
          label="Personalisation"
          icon={<User size={22} color={colors.primary} strokeWidth={2} />}
          value={personalisation}
          onValueChange={setPersonalisation}
          isLast
        />
      </SettingsSection>

      <SettingsSection title="Data Export">
        <SettingsLinkItemRow
          label="Export as PDF"
          icon={<FileText size={22} color={colors.primary} strokeWidth={2} />}
          onPress={() => {}}
        />
        <SettingsLinkItemRow
          label="Export as CSV"
          icon={<FileSpreadsheet size={22} color={colors.primary} strokeWidth={2} />}
          onPress={() => {}}
          isLast
        />
      </SettingsSection>

      <SettingsSection title="Support">
        <SettingsLinkItemRow
          label="Help Centre"
          icon={<HelpCircle size={22} color={colors.primary} strokeWidth={2} />}
          onPress={() => router.push('/settings/help')}
        />
        <SettingsLinkItemRow
          label="Contact Us"
          icon={<Mail size={22} color={colors.primary} strokeWidth={2} />}
          onPress={() => router.push('/settings/help')}
          isLast
        />
      </SettingsSection>

      <Pressable
        onPress={() => {
          if (user) {
            logout.mutate();
          }
        }}
        style={({ pressed }) => [
          styles.logoutButton,
          { backgroundColor: colors.surface, borderColor: colors.border },
          pressed && styles.pressed,
        ]}
      >
        <Text style={[styles.logoutText, { color: colors.error }]}>Log Out</Text>
      </Pressable>

      <Text style={[styles.version, { color: colors.textSecondary }]}>
        Bobble v{version} (Build {buildNumber})
      </Text>
    </SettingsScreenLayout>
  );
}

const styles = StyleSheet.create({
  logoutButton: {
    borderRadius: 16,
    borderWidth: StyleSheet.hairlineWidth,
    paddingVertical: 16,
    alignItems: 'center',
  },
  logoutText: {
    ...Typography.body,
    fontFamily: Typography.button.fontFamily,
  },
  version: {
    ...Typography.caption,
    textAlign: 'center',
    marginTop: 4,
  },
  pressed: {
    opacity: 0.85,
  },
});
