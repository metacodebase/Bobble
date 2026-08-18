import * as Calendar from 'expo-calendar';
import { RefreshCw } from 'lucide-react-native';
import { useCallback, useEffect, useState } from 'react';
import { ActivityIndicator, Alert, StyleSheet, Text, View } from 'react-native';

import {
  CalendarProviderIcon,
  type CalendarProvider,
} from '@/src/components/create-account/calendar-brand-icons';
import { CalendarRow } from '@/src/components/create-account/calendar-row';
import { PickerModal } from '@/src/components/create-account/picker-modal';
import { SecondaryButton } from '@/src/components/home/secondary-button';
import { PrimaryButton } from '@/src/components/onboarding/primary-button';
import {
  SettingsDescription,
  SettingsScreenLayout,
} from '@/src/components/settings/settings-screen-layout';
import {
  AppleRemindersSyncRow,
  NotionSyncRow,
} from '@/src/components/settings/calendar-sync-integrations';
import { useBobbleColors } from '@/src/hooks/use-bobble-colors';
import { resyncAllTasksToCalendar, validateCalendarConnection } from '@/src/services/calendar-sync';
import { useAppStore } from '@/src/store/app-store';
import { Typography } from '@/src/theme/fonts';

import { ActionSheet } from '@/src/components/ui/action-sheet';
import { toast } from '@/src/utils/toast';

const PROVIDERS = [
  { id: 'google', name: 'Google Calendar', provider: 'google' as CalendarProvider },
  { id: 'apple', name: 'Apple Calendar', provider: 'apple' as CalendarProvider },
  { id: 'outlook', name: 'Outlook Calendar', provider: 'outlook' as CalendarProvider },
];

export default function CalendarSyncScreen() {
  const colors = useBobbleColors();
  const syncCalendarId = useAppStore((state) => state.syncCalendarId);
  const setSyncCalendarId = useAppStore((state) => state.setSyncCalendarId);

  const [permissionStatus, setPermissionStatus] = useState<Calendar.PermissionStatus | null>(null);
  const [calendars, setCalendars] = useState<Calendar.Calendar[]>([]);
  const [loading, setLoading] = useState(true);
  const [resyncing, setResyncing] = useState(false);

  // Picker State
  const [pickerVisible, setPickerVisible] = useState(false);
  const [activeProvider, setActiveProvider] = useState<(typeof PROVIDERS)[0] | null>(null);

  // Missing Calendars Alert State
  const [missingAlertVisible, setMissingAlertVisible] = useState(false);
  const [missingProvider, setMissingProvider] = useState<(typeof PROVIDERS)[0] | null>(null);

  const fetchCalendars = useCallback(async () => {
    setLoading(true);
    try {
      const deviceCalendars = await Calendar.getCalendarsAsync(Calendar.EntityTypes.EVENT);
      const writableCalendars = deviceCalendars.filter(
        (calendar) =>
          calendar.allowsModifications ||
          calendar.accessLevel === Calendar.CalendarAccessLevel.OWNER ||
          calendar.accessLevel === Calendar.CalendarAccessLevel.CONTRIBUTOR
      );
      setCalendars(writableCalendars);
    } catch (error) {
      console.error('Failed to fetch calendars:', error);
      Alert.alert('Error', 'Failed to load calendars.');
    } finally {
      setLoading(false);
    }
  }, []);

  const checkPermissions = useCallback(async () => {
    const { status } = await Calendar.getCalendarPermissionsAsync();
    setPermissionStatus(status);
    if (status === 'granted') {
      await fetchCalendars();
    } else {
      setLoading(false);
    }
  }, [fetchCalendars]);

  useEffect(() => {
    void checkPermissions();
  }, [checkPermissions]);

  const requestPermissions = async () => {
    const { status } = await Calendar.requestCalendarPermissionsAsync();
    setPermissionStatus(status);
    if (status === 'granted') {
      await fetchCalendars();
    } else {
      Alert.alert(
        'Permission Denied',
        'You need to grant calendar access in your device settings.'
      );
    }
  };

  function getCalendarProvider(calendar: Calendar.Calendar): CalendarProvider | null {
    const sourceName = (calendar.source?.name || '').toLowerCase();
    const sourceType = (calendar.source?.type || '').toString().toLowerCase();
    const calendarType = (calendar.type || '').toString().toLowerCase();

    if (
      sourceName.includes('google') ||
      sourceName.includes('gmail') ||
      sourceType.includes('google')
    ) {
      return 'google';
    }
    if (
      sourceName.includes('icloud') ||
      sourceName.includes('apple') ||
      sourceType.includes('caldav') ||
      sourceType.includes('local') ||
      sourceType.includes('mobileme') ||
      calendarType.includes('local') ||
      calendarType.includes('caldav')
    ) {
      return 'apple';
    }
    if (
      sourceName.includes('outlook') ||
      sourceName.includes('exchange') ||
      sourceName.includes('hotmail') ||
      sourceType.includes('exchange')
    ) {
      return 'outlook';
    }
    return null;
  }

  const handleResync = async () => {
    if (!syncCalendarId || resyncing) return;
    setResyncing(true);
    try {
      const connection = await validateCalendarConnection();
      if (connection !== 'ready') {
        toast.error(
          connection === 'permission_denied'
            ? 'Calendar permission is no longer available.'
            : 'The connected calendar is unavailable or read-only.',
          'Calendar sync failed'
        );
        return;
      }
      const result = await resyncAllTasksToCalendar();
      if (result.total === 0) {
        toast.success('Only tasks with a due date are synced', 'Nothing to sync');
      } else if (result.failed > 0) {
        toast.error(
          `${result.failed} of ${result.total} tasks could not be synced. Check the selected calendar and permission.`,
          'Calendar sync incomplete'
        );
      } else {
        toast.success(
          `Synced ${result.synced} task${result.synced === 1 ? '' : 's'} to your calendar`
        );
      }
    } catch (error) {
      console.error('Calendar re-sync failed:', error);
      toast.error('Could not sync tasks to calendar');
    } finally {
      setResyncing(false);
    }
  };

  const handleCalendarConnected = async (id: string) => {
    setSyncCalendarId(id);
    setPickerVisible(false);
    const selectedCal = calendars.find((c) => c.id === id);
    setResyncing(true);
    try {
      const connection = await validateCalendarConnection();
      if (connection !== 'ready') {
        setSyncCalendarId(null);
        toast.error(
          connection === 'permission_denied'
            ? 'Calendar permission is no longer available.'
            : 'The selected calendar is unavailable or read-only.',
          'Calendar connection failed'
        );
        return;
      }

      if (selectedCal) {
        toast.success(`Tasks will now sync to ${selectedCal.title}`);
      }
      const result = await resyncAllTasksToCalendar();
      if (result.failed > 0) {
        toast.error(
          `${result.failed} existing task${result.failed === 1 ? '' : 's'} could not be synced. Try Re-sync all tasks.`,
          'Calendar sync incomplete'
        );
      } else if (result.synced > 0) {
        toast.success(
          `Synced ${result.synced} existing task${result.synced === 1 ? '' : 's'} to your calendar`
        );
      }
    } catch (error) {
      console.error('Initial calendar sync failed:', error);
    } finally {
      setResyncing(false);
    }
  };

  const handleProviderPress = (providerItem: (typeof PROVIDERS)[0]) => {
    const matchingCalendars = calendars.filter(
      (c) => getCalendarProvider(c) === providerItem.provider
    );

    if (matchingCalendars.length === 0) {
      setMissingProvider(providerItem);
      setMissingAlertVisible(true);
      return;
    }

    setActiveProvider(providerItem);
    setPickerVisible(true);
  };

  // Prepare picker options based on the active provider
  const pickerOptions = activeProvider
    ? calendars
        .filter((c) => getCalendarProvider(c) === activeProvider.provider)
        .map((c) => ({
          id: c.id,
          label: c.source?.name || c.title,
          sublabel: c.source?.name && c.source.name !== c.title ? c.title : undefined,
        }))
    : [];

  return (
    <SettingsScreenLayout title="Calendar Sync">
      <SettingsDescription>
        Connect calendars, Apple Reminders, or Notion to keep tasks from your Bobbles in sync.
      </SettingsDescription>

      <View>
        <AppleRemindersSyncRow />
        <NotionSyncRow />

        {loading ? (
          <View style={styles.center}>
            <ActivityIndicator size="large" color={colors.primary} />
          </View>
        ) : permissionStatus !== 'granted' ? (
          <View style={styles.center}>
            <Text style={[styles.message, { color: colors.textSecondary }]}>
              Bobble needs access to your calendar to sync tasks.
            </Text>
            <PrimaryButton label="Grant Calendar Access" onPress={requestPermissions} />
          </View>
        ) : (
          <View>
          {PROVIDERS.map((providerItem) => {
            // Check if any calendar belonging to this provider is currently selected
            const providerCalendars = calendars.filter(
              (c) => getCalendarProvider(c) === providerItem.provider
            );
            const isConnected = providerCalendars.some((c) => c.id === syncCalendarId);

            return (
              <CalendarRow
                key={providerItem.id}
                name={providerItem.name}
                icon={<CalendarProviderIcon provider={providerItem.provider} size={32} />}
                status={isConnected ? 'connected' : 'idle'}
                buttonLabel={isConnected ? 'Connected' : 'Connect'}
                onConnect={() => {
                  if (isConnected) {
                    setSyncCalendarId(null);
                  } else {
                    handleProviderPress(providerItem);
                  }
                }}
              />
            );
          })}

          {syncCalendarId ? (
            <View style={styles.resyncSection}>
              <Text style={[styles.resyncHint, { color: colors.textSecondary }]}>
                Tasks with a due date sync automatically. Re-sync if you deleted events from your
                calendar or tasks are missing.
              </Text>
              <SecondaryButton
                label={resyncing ? 'Syncing…' : 'Re-sync all tasks'}
                icon={RefreshCw}
                onPress={() => void handleResync()}
                style={resyncing ? styles.resyncDisabled : undefined}
              />
            </View>
          ) : null}
          </View>
        )}
      </View>

      <PickerModal
        visible={pickerVisible}
        title={`Select ${activeProvider?.name}`}
        searchPlaceholder="Search accounts..."
        selectedId={syncCalendarId || undefined}
        options={pickerOptions}
        onSelect={(id) => void handleCalendarConnected(id)}
        onClose={() => setPickerVisible(false)}
      />

      <ActionSheet
        visible={missingAlertVisible}
        title="No Calendars Found"
        subtitle={`We couldn't find any ${missingProvider?.name} accounts synced to this device. Please add the account in your phone's Settings app first.`}
        options={[]}
        onClose={() => setMissingAlertVisible(false)}
      />
    </SettingsScreenLayout>
  );
}

const styles = StyleSheet.create({
  center: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 40,
    gap: 20,
  },
  message: {
    ...Typography.body,
    textAlign: 'center',
    paddingHorizontal: 20,
  },
  resyncSection: {
    marginTop: 8,
    gap: 12,
  },
  resyncHint: {
    ...Typography.caption,
    lineHeight: 18,
  },
  resyncDisabled: {
    opacity: 0.6,
  },
});
