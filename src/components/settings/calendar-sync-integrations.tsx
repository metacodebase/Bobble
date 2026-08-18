import * as Calendar from 'expo-calendar';
import * as Linking from 'expo-linking';
import { useFocusEffect } from 'expo-router';
import { useCallback, useState } from 'react';
import { Alert, Platform } from 'react-native';

import { integrationsApi } from '@/src/api';
import type { NotionDataSource, NotionStatus } from '@/src/api/integrations';
import { CalendarProviderIcon } from '@/src/components/create-account/calendar-brand-icons';
import { CalendarRow } from '@/src/components/create-account/calendar-row';
import { PickerModal } from '@/src/components/create-account/picker-modal';
import {
  listWritableReminderLists,
  resyncAllTasksToAppleReminders,
} from '@/src/services/apple-reminders-sync';
import { useAppStore } from '@/src/store/app-store';
import { toast } from '@/src/utils/toast';

export function AppleRemindersSyncRow() {
  const selectedId = useAppStore((state) => state.syncReminderListId);
  const setSelectedId = useAppStore((state) => state.setSyncReminderListId);
  const [lists, setLists] = useState<Calendar.Calendar[]>([]);
  const [visible, setVisible] = useState(false);
  const [loading, setLoading] = useState(false);
  if (Platform.OS !== 'ios') return null;

  const connect = async () => {
    if (selectedId) {
      setSelectedId(null);
      return;
    }
    setLoading(true);
    try {
      const permission = await Calendar.requestRemindersPermissionsAsync();
      if (permission.status !== 'granted') {
        Alert.alert('Permission denied', 'Enable Reminders access in iOS Settings to sync tasks.');
        return;
      }
      const available = await listWritableReminderLists();
      setLists(available);
      setVisible(true);
    } catch {
      toast.error('Could not load Apple Reminders lists');
    } finally {
      setLoading(false);
    }
  };

  const select = async (id: string) => {
    setSelectedId(id);
    setVisible(false);
    const failures = await resyncAllTasksToAppleReminders();
    if (failures) toast.error(`${failures} reminders could not be synced`);
    else toast.success('Apple Reminders connected');
  };

  return (
    <>
      <CalendarRow
        name="Apple Reminders"
        icon={<CalendarProviderIcon provider="apple-reminders" size={32} />}
        status={loading ? 'loading' : selectedId ? 'connected' : 'idle'}
        onConnect={() => void connect()}
      />
      <PickerModal
        visible={visible}
        title="Select Reminders list"
        selectedId={selectedId ?? undefined}
        options={lists.map((list) => ({ id: list.id, label: list.title }))}
        onSelect={(id) => void select(id)}
        onClose={() => setVisible(false)}
      />
    </>
  );
}

export function NotionSyncRow() {
  const isAuthenticated = useAppStore((state) => state.isAuthenticated);
  const [status, setStatus] = useState<NotionStatus>();
  const [sources, setSources] = useState<NotionDataSource[]>([]);
  const [loading, setLoading] = useState(false);
  const [visible, setVisible] = useState(false);

  const refresh = useCallback(async () => {
    if (!isAuthenticated) return;
    try {
      const next = await integrationsApi.getNotionStatus();
      setStatus(next);
      if (next.connected && !next.dataSourceId) {
        setSources(await integrationsApi.listNotionDataSources());
        setVisible(true);
      }
    } catch {
      setStatus(undefined);
    }
  }, [isAuthenticated]);

  useFocusEffect(useCallback(() => void refresh(), [refresh]));
  if (!isAuthenticated) return null;

  const connect = async () => {
    if (status?.dataSourceId) {
      Alert.alert('Disconnect Notion?', 'Bobble will stop syncing tasks to Notion.', [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Disconnect', style: 'destructive', onPress: () => void disconnect() },
      ]);
      return;
    }
    setLoading(true);
    try {
      if (status?.connected) {
        setSources(await integrationsApi.listNotionDataSources());
        setVisible(true);
      } else {
        const { url } = await integrationsApi.getNotionAuthorizationUrl();
        await Linking.openURL(url);
      }
    } catch {
      toast.error('Could not connect Notion');
    } finally {
      setLoading(false);
    }
  };

  const disconnect = async () => {
    await integrationsApi.disconnectNotion();
    setStatus({ configured: status?.configured ?? true, connected: false });
    toast.success('Notion disconnected');
  };

  const select = async (id: string) => {
    setLoading(true);
    try {
      setStatus(await integrationsApi.selectNotionDataSource(id));
      setVisible(false);
      const result = await integrationsApi.resyncNotionTasks();
      if (result.failed) toast.error(`${result.failed} Notion tasks could not be synced`);
      else toast.success('Notion connected');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <CalendarRow
        name={status?.dataSourceName ? `Notion · ${status.dataSourceName}` : 'Notion'}
        icon={<CalendarProviderIcon provider="notion" size={32} />}
        status={loading ? 'loading' : status?.dataSourceId ? 'connected' : 'idle'}
        buttonLabel={status?.connected ? 'Choose database' : 'Connect'}
        onConnect={() => void connect()}
      />
      <PickerModal
        visible={visible}
        title="Select Notion database"
        selectedId={status?.dataSourceId}
        options={sources.map((source) => ({ id: source.id, label: source.name }))}
        onSelect={(id) => void select(id)}
        onClose={() => setVisible(false)}
      />
    </>
  );
}
