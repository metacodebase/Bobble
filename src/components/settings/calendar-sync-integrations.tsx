import * as Calendar from 'expo-calendar';
import * as Linking from 'expo-linking';
import { useFocusEffect } from 'expo-router';
import * as WebBrowser from 'expo-web-browser';
import { useCallback, useState } from 'react';
import { Alert, Platform } from 'react-native';

import { integrationsApi } from '@/src/api';
import type { NotionDataSource, NotionStatus } from '@/src/api/integrations';
import { CalendarProviderIcon } from '@/src/components/create-account/calendar-brand-icons';
import { CalendarRow } from '@/src/components/create-account/calendar-row';
import { PickerModal } from '@/src/components/create-account/picker-modal';
import { ActionSheet } from '@/src/components/ui/action-sheet';
import {
  listWritableReminderLists,
  resyncAllTasksToAppleReminders,
} from '@/src/services/apple-reminders-sync';
import { useAppStore } from '@/src/store/app-store';
import { getApiErrorMessage } from '@/src/utils/api-error';
import { toast } from '@/src/utils/toast';

type SyncError = { title: string; message: string };

function SyncErrorSheet({ error, clear }: { error: SyncError | null; clear: () => void }) {
  return (
    <ActionSheet
      visible={Boolean(error)}
      title={error?.title}
      subtitle={error?.message}
      options={[]}
      onClose={clear}
    />
  );
}

export function AppleRemindersSyncRow() {
  const selectedId = useAppStore((state) => state.syncReminderListId);
  const setSelectedId = useAppStore((state) => state.setSyncReminderListId);
  const [lists, setLists] = useState<Calendar.Calendar[]>([]);
  const [visible, setVisible] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<SyncError | null>(null);
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
        setError({
          title: 'Reminders Access Needed',
          message: 'Enable Reminders access for Bobble in iOS Settings, then try again.',
        });
        return;
      }
      const available = await listWritableReminderLists();
      if (available.length === 0) {
        setError({
          title: 'No Reminder Lists Found',
          message: 'Create a list in Apple Reminders or enable an editable reminders account.',
        });
        return;
      }
      setLists(available);
      setVisible(true);
    } catch (cause) {
      setError({
        title: 'Apple Reminders Unavailable',
        message: getApiErrorMessage(cause, 'Could not load your Apple Reminders lists.'),
      });
    } finally {
      setLoading(false);
    }
  };

  const select = async (id: string) => {
    setLoading(true);
    try {
      setSelectedId(id);
      setVisible(false);
      const failures = await resyncAllTasksToAppleReminders();
      if (failures) {
        setError({
          title: 'Reminder Sync Incomplete',
          message: `${failures} task${failures === 1 ? '' : 's'} could not be synced. Please try again.`,
        });
      } else toast.success('Apple Reminders connected');
    } catch (cause) {
      setSelectedId(null);
      setError({
        title: 'Could Not Connect Reminders',
        message: getApiErrorMessage(cause, 'Apple Reminders could not be connected.'),
      });
    } finally {
      setLoading(false);
    }
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
      <SyncErrorSheet error={error} clear={() => setError(null)} />
    </>
  );
}

function useNotionSync() {
  const isAuthenticated = useAppStore((state) => state.isAuthenticated);
  const [status, setStatus] = useState<NotionStatus>();
  const [sources, setSources] = useState<NotionDataSource[]>([]);
  const [loading, setLoading] = useState(false);
  const [visible, setVisible] = useState(false);
  const [error, setError] = useState<SyncError | null>(null);

  const chooseDataSource = useCallback(async () => {
    const available = await integrationsApi.listNotionDataSources();
    if (available.length === 0) {
      setError({
        title: 'No Notion Databases Found',
        message: 'Share a Notion database with the Bobble integration, then try again.',
      });
      return;
    }
    setSources(available);
    setVisible(true);
  }, []);

  const refresh = useCallback(async () => {
    if (!isAuthenticated) return;
    try {
      const next = await integrationsApi.getNotionStatus();
      setStatus(next);
      if (next.connected && !next.dataSourceId) {
        await chooseDataSource();
      }
    } catch (cause) {
      setStatus(undefined);
      setError({
        title: 'Notion Unavailable',
        message: getApiErrorMessage(cause, 'Could not check your Notion connection.'),
      });
    }
  }, [chooseDataSource, isAuthenticated]);

  useFocusEffect(useCallback(() => void refresh(), [refresh]));

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
        await chooseDataSource();
      } else {
        const { url } = await integrationsApi.getNotionAuthorizationUrl();
        const result = await WebBrowser.openAuthSessionAsync(
          url,
          Linking.createURL('settings/calendar-sync')
        );
        if (result.type === 'success') {
          const { queryParams } = Linking.parse(result.url);
          if (queryParams?.notion === 'error') {
            setError({
              title: 'Could Not Connect Notion',
              message: 'Notion authorization did not complete. Please try connecting again.',
            });
          } else {
            await refresh();
          }
        }
      }
    } catch (cause) {
      setError({
        title: status?.configured === false ? 'Notion Setup Required' : 'Could Not Connect Notion',
        message: getApiErrorMessage(cause, 'Check your connection and try again.'),
      });
    } finally {
      setLoading(false);
    }
  };

  const disconnect = async () => {
    setLoading(true);
    try {
      await integrationsApi.disconnectNotion();
      setStatus({ configured: status?.configured ?? true, connected: false });
      toast.success('Notion disconnected');
    } catch (cause) {
      setError({
        title: 'Could Not Disconnect Notion',
        message: getApiErrorMessage(cause, 'Your Notion connection was not changed.'),
      });
    } finally {
      setLoading(false);
    }
  };

  const select = async (id: string) => {
    setLoading(true);
    try {
      setStatus(await integrationsApi.selectNotionDataSource(id));
      setVisible(false);
      const result = await integrationsApi.resyncNotionTasks();
      if (result.failed) {
        setError({
          title: 'Notion Sync Incomplete',
          message: `${result.failed} task${result.failed === 1 ? '' : 's'} could not be synced. Please try again.`,
        });
      } else toast.success('Notion connected');
    } catch (cause) {
      setError({
        title: 'Could Not Select Database',
        message: getApiErrorMessage(cause, 'Bobble could not connect to that Notion database.'),
      });
    } finally {
      setLoading(false);
    }
  };

  return {
    connect,
    error,
    isAuthenticated,
    loading,
    select,
    setError,
    setVisible,
    sources,
    status,
    visible,
  };
}

export function NotionSyncRow() {
  const sync = useNotionSync();
  if (!sync.isAuthenticated) return null;

  return (
    <>
      <CalendarRow
        name={sync.status?.dataSourceName ? `Notion · ${sync.status.dataSourceName}` : 'Notion'}
        icon={<CalendarProviderIcon provider="notion" size={32} />}
        status={sync.loading ? 'loading' : sync.status?.dataSourceId ? 'connected' : 'idle'}
        buttonLabel={sync.status?.connected ? 'Choose database' : 'Connect'}
        onConnect={() => void sync.connect()}
      />
      <PickerModal
        visible={sync.visible}
        title="Select Notion database"
        selectedId={sync.status?.dataSourceId}
        options={sync.sources.map((source) => ({ id: source.id, label: source.name }))}
        onSelect={(id) => void sync.select(id)}
        onClose={() => sync.setVisible(false)}
      />
      <SyncErrorSheet error={sync.error} clear={() => sync.setError(null)} />
    </>
  );
}
