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
  reminderWriteQueue = result.then(() => undefined, () => undefined);
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

async function syncNow(task: Task): Promise<ReminderSyncResult> {
  const listId = useAppStore.getState().syncReminderListId;
  if (Platform.OS !== 'ios' || !listId) return { taskId: task._id, status: 'skipped' };

  const permission = await Calendar.getRemindersPermissionsAsync();
  if (permission.status !== 'granted') return { taskId: task._id, status: 'failed' };

  const mapping = await getMapping();
  let reminderId: string | undefined = mapping[task._id];
  const details: Calendar.Reminder = {
    title: task.title,
    notes: task.notes || 'Synced from Bobble',
    completed: task.done,
    completionDate: task.done ? new Date() : undefined,
    dueDate: task.dueAt ? new Date(task.dueAt) : undefined,
    alarms: task.dueAt ? [{ relativeOffset: -15 }] : undefined,
  };

  try {
    if (reminderId) {
      try {
        await Calendar.getReminderAsync(reminderId);
      } catch {
        delete mapping[task._id];
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
  const results = await Promise.all(tasks.map(syncTaskToAppleReminders));
  return results.filter((result) => result.status === 'failed').length;
}

export async function resyncAllTasksToAppleReminders() {
  return syncTasksToAppleReminders(await tasksApi.listTasks('all'));
}

export function removeTaskFromAppleReminders(taskId: string) {
  return enqueue(async (): Promise<ReminderSyncResult> => {
    const mapping = await getMapping();
    const reminderId = mapping[taskId];
    if (!reminderId) return { taskId, status: 'skipped' };
    try {
      await Calendar.deleteReminderAsync(reminderId);
      delete mapping[taskId];
      await saveMapping(mapping);
      return { taskId, status: 'removed' };
    } catch (error) {
      if (__DEV__) console.warn('[apple-reminders] removal failed', error);
      return { taskId, status: 'failed' };
    }
  });
}
