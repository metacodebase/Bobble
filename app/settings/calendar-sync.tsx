import { useEffect, useState } from 'react';
import { ActivityIndicator, Alert, ScrollView, StyleSheet, Text, View } from 'react-native';
import * as Calendar from 'expo-calendar';

import { CalendarRow } from '@/src/components/create-account/calendar-row';
import { CalendarProviderIcon, type CalendarProvider } from '@/src/components/create-account/calendar-brand-icons';
import { PickerModal } from '@/src/components/create-account/picker-modal';
import {
    SettingsDescription,
    SettingsScreenLayout,
} from '@/src/components/settings/settings-screen-layout';
import { useBobbleColors } from '@/src/hooks/use-bobble-colors';
import { PrimaryButton } from '@/src/components/onboarding/primary-button';
import { Typography } from '@/src/theme/fonts';
import { useAppStore } from '@/src/store/app-store';

import { toast } from '@/src/utils/toast';
import { ActionSheet } from '@/src/components/ui/action-sheet';

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

  // Picker State
  const [pickerVisible, setPickerVisible] = useState(false);
  const [activeProvider, setActiveProvider] = useState<typeof PROVIDERS[0] | null>(null);

  // Missing Calendars Alert State
  const [missingAlertVisible, setMissingAlertVisible] = useState(false);
  const [missingProvider, setMissingProvider] = useState<typeof PROVIDERS[0] | null>(null);

  useEffect(() => {
    checkPermissions();
  }, []);

  const checkPermissions = async () => {
    const { status } = await Calendar.getCalendarPermissionsAsync();
    setPermissionStatus(status);
    if (status === 'granted') {
      fetchCalendars();
    } else {
      setLoading(false);
    }
  };

  const requestPermissions = async () => {
    const { status } = await Calendar.requestCalendarPermissionsAsync();
    setPermissionStatus(status);
    if (status === 'granted') {
      fetchCalendars();
    } else {
      Alert.alert('Permission Denied', 'You need to grant calendar access in your device settings.');
    }
  };

  const fetchCalendars = async () => {
    setLoading(true);
    try {
      const deviceCalendars = await Calendar.getCalendarsAsync(Calendar.EntityTypes.EVENT);
      // Filter out read-only calendars on iOS, but on Android allowsModifications is often false or undefined for local calendars
      // depending on the provider, so we'll be more permissive on Android.
      const writableCalendars = deviceCalendars.filter(cal => 
        cal.allowsModifications || cal.accessLevel === Calendar.CalendarAccessLevel.OWNER || cal.accessLevel === Calendar.CalendarAccessLevel.CONTRIBUTOR
      );
      
      // If we still get nothing, just show all calendars so the user has something to pick
      setCalendars(writableCalendars.length > 0 ? writableCalendars : deviceCalendars);
    } catch (error) {
      console.error('Failed to fetch calendars:', error);
      Alert.alert('Error', 'Failed to load calendars.');
    } finally {
      setLoading(false);
    }
  };

  function getCalendarProvider(calendar: Calendar.Calendar): CalendarProvider | null {
    const sourceName = (calendar.source?.name || '').toLowerCase();
    const sourceType = (calendar.source?.type || '').toString().toLowerCase();

    if (sourceName.includes('google') || sourceName.includes('gmail') || sourceType.includes('google')) {
      return 'google';
    }
    if (sourceName.includes('icloud') || sourceName.includes('apple') || sourceType.includes('caldav')) {
      return 'apple';
    }
    if (sourceName.includes('outlook') || sourceName.includes('exchange') || sourceName.includes('hotmail') || sourceType.includes('exchange')) {
      return 'outlook';
    }
    return null;
  }

  const handleProviderPress = (providerItem: typeof PROVIDERS[0]) => {
    const matchingCalendars = calendars.filter(c => getCalendarProvider(c) === providerItem.provider);
    
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
        .filter(c => getCalendarProvider(c) === activeProvider.provider)
        .map(c => ({
          id: c.id,
          label: c.source?.name || c.title,
          sublabel: c.source?.name && c.source.name !== c.title ? c.title : undefined,
        }))
    : [];

  return (
    <SettingsScreenLayout title="Calendar Sync">
      <SettingsDescription>
        Connect calendars to sync tasks and events from your Bobbles.
      </SettingsDescription>

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
        <ScrollView style={styles.list} contentContainerStyle={styles.listContent}>
          {PROVIDERS.map((providerItem) => {
            // Check if any calendar belonging to this provider is currently selected
            const providerCalendars = calendars.filter(c => getCalendarProvider(c) === providerItem.provider);
            const isConnected = providerCalendars.some(c => c.id === syncCalendarId);
            
            return (
              <CalendarRow
                key={providerItem.id}
                name={providerItem.name}
                icon={<CalendarProviderIcon provider={providerItem.provider} size={24} />}
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
        </ScrollView>
      )}

      <PickerModal
        visible={pickerVisible}
        title={`Select ${activeProvider?.name}`}
        searchPlaceholder="Search accounts..."
        selectedId={syncCalendarId || undefined}
        options={pickerOptions}
        onSelect={(id) => {
          setSyncCalendarId(id);
          setPickerVisible(false);
          const selectedCal = calendars.find(c => c.id === id);
          if (selectedCal) {
            toast.success(`Tasks will now sync to ${selectedCal.title}`);
          }
        }}
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
  list: {
    flex: 1,
  },
  listContent: {
    gap: 12,
    paddingBottom: 20,
  },
});
