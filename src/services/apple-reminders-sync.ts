import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Calendar from 'expo-calendar';
import { Platform } from 'react-native';

import { tasksApi } from '@/src/api';
import type { Task } from '@/src/features/tasks/types';
import { useAppStore } from '@/src/store/app-store';

const MAPPING_KEY = '@bobble/apple-reminder-mapping';
let reminderWriteQueue: Promise<void> = Promise.resolve();

function mappingKey() {
  const state = useAppStore.getState();
  return `${MAPPING_KEY}:${state.user?._id ?? (state.isGuest ? 'guest' : 'signed-out')}`;
}

async function getMapping(): Promise<Record<string, string>> {
  try {
    return JSON.parse((await AsyncStorage.getItem(mappingKey())) ?? '{}');
  } catch {
    return {};
  }
}

async function saveMapping(mapping: Record<string, string>) {
  await AsyncStorage.setItem(mappingKey(), JSON.stringify(mapping));
}

function enqueue<T>(operation: () => Promise<T>): Promise<T> {
  const result = reminderWriteQueue.then(operation, operation);
  reminderWriteQueue = result.then(
    () => undefined,
    () => undefined
  );
  return result;
}

export type ReminderSyncResult = {
  taskId: string;
  status: 'synced' | 'removed' | 'skipped' | 'failed';
};

export async function listWritableReminderLists(): Promise<Calendar.Calendar[]> {
  if (Platform.OS !== 'ios') return [];
  const lists = await Calendar.getCalendarsAsync(Calendar.EntityTypes.REMINDER);
  return lists.filter((list) => list.allowsModifications);
}

export async function validateAppleRemindersConnection(): Promise<
  'ready' | 'not_connected' | 'permission_denied' | 'list_unavailable'
> {
  const listId = useAppStore.getState().syncReminderListId;
  if (Platform.OS !== 'ios' || !listId) return 'not_connected';

  try {
    const permission = await Calendar.getRemindersPermissionsAsync();
    if (permission.status !== 'granted') return 'permission_denied';
    const lists = await listWritableReminderLists();
    return lists.some((list) => list.id === listId) ? 'ready' : 'list_unavailable';
  } catch {
    return 'permission_denied';
  }
}

async function removeMappedReminder(
  taskId: string,
  mapping: Record<string, string>
): Promise<boolean> {
  const reminderId = mapping[taskId];
  if (!reminderId) return true;

  try {
    await Calendar.getReminderAsync(reminderId);
  } catch {
    delete mapping[taskId];
    await saveMapping(mapping);
    return true;
  }

  try {
    await Calendar.deleteReminderAsync(reminderId);
    delete mapping[taskId];
    await saveMapping(mapping);
    return true;
  } catch {
    return false;
  }
}

async function syncNow(task: Task): Promise<ReminderSyncResult> {
  const listId = useAppStore.getState().syncReminderListId;
  if (Platform.OS !== 'ios' || !listId) return { taskId: task._id, status: 'skipped' };

  const permission = await Calendar.getRemindersPermissionsAsync();
  if (permission.status !== 'granted') return { taskId: task._id, status: 'failed' };

  const mapping = await getMapping();
  let reminderId: string | undefined = mapping[task._id];
  if (task.done) {
    const removed = await removeMappedReminder(task._id, mapping);
    return removed
      ? { taskId: task._id, status: reminderId ? 'removed' : 'skipped' }
      : { taskId: task._id, status: 'failed' };
  }
  const details: Calendar.Reminder = {
    title: task.title,
    notes: task.notes || 'Synced from Bobble',
    completed: false,
    dueDate: task.dueAt ? new Date(task.dueAt) : undefined,
    alarms: task.dueAt ? [{ relativeOffset: -15 }] : undefined,
  };

  try {
    if (reminderId) {
      try {
        const reminder = await Calendar.getReminderAsync(reminderId);
        if (reminder.calendarId !== listId) {
          if (!(await removeMappedReminder(task._id, mapping))) {
            return { taskId: task._id, status: 'failed' };
          }
          reminderId = undefined;
        }
      } catch {
        delete mapping[task._id];
        await saveMapping(mapping);
        reminderId = undefined;
      }
    }
    if (reminderId) {
      await Calendar.updateReminderAsync(reminderId, details);
    } else {
      reminderId = await Calendar.createReminderAsync(listId, details);
      mapping[task._id] = reminderId;
    }
    await saveMapping(mapping);
    return { taskId: task._id, status: 'synced' };
  } catch (error) {
    if (__DEV__) console.warn('[apple-reminders] sync failed', error);
    return { taskId: task._id, status: 'failed' };
  }
}

export function syncTaskToAppleReminders(task: Task) {
  return enqueue(() => syncNow(task));
}

export async function syncTasksToAppleReminders(tasks: Task[]) {
  let failures = 0;
  for (const task of tasks) {
    const result = await syncTaskToAppleReminders(task);
    if (result.status === 'failed') failures += 1;
  }
  return failures;
}

export async function resyncAllTasksToAppleReminders() {
  if ((await validateAppleRemindersConnection()) !== 'ready') return 0;

  const tasks = await tasksApi.listTasks('all');
  const tasksById = new Map(tasks.map((task) => [task._id, task]));
  const mapping = await enqueue(() => getMapping());
  const staleTaskIds = Object.keys(mapping).filter((taskId) => {
    const task = tasksById.get(taskId);
    return !task || task.done;
  });
  let failures = 0;

  for (const taskId of staleTaskIds) {
    const result = await removeTaskFromAppleReminders(taskId);
    if (result.status === 'failed') failures += 1;
  }

  return failures + (await syncTasksToAppleReminders(tasks.filter((task) => !task.done)));
}

export function removeTaskFromAppleReminders(taskId: string) {
  return enqueue(async (): Promise<ReminderSyncResult> => {
    const mapping = await getMapping();
    const reminderId = mapping[taskId];
    if (!reminderId) return { taskId, status: 'skipped' };
    try {
      const permission = await Calendar.getRemindersPermissionsAsync();
      if (permission.status !== 'granted') return { taskId, status: 'failed' };
      return (await removeMappedReminder(taskId, mapping))
        ? { taskId, status: 'removed' }
        : { taskId, status: 'failed' };
    } catch (error) {
      if (__DEV__) console.warn('[apple-reminders] removal failed', error);
      return { taskId, status: 'failed' };
    }
  });
}
