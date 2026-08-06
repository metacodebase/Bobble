import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Calendar from 'expo-calendar';

import { tasksApi } from '@/src/api';
import type { Task } from '@/src/features/tasks/types';
import { secureStorage } from '@/src/services/secure-storage';
import { useAppStore } from '@/src/store/app-store';

const LEGACY_EVENT_MAPPING_KEY = 'calendar-event-mapping';
const EVENT_MAPPING_KEY = '@bobble/calendar-event-mapping';
const EXISTING_EVENT_TIME_TOLERANCE_MS = 60_000;

function eventMappingKey(): string {
  const state = useAppStore.getState();
  const owner = state.user?._id ?? (state.isGuest ? 'guest' : 'signed-out');
  return `${EVENT_MAPPING_KEY}:${owner}`;
}

export type CalendarSyncResult = {
  taskId: string;
  status: 'synced' | 'removed' | 'skipped' | 'failed';
  reason?:
    | 'not_connected'
    | 'permission_denied'
    | 'calendar_unavailable'
    | 'no_due_date'
    | 'completed'
    | 'write_failed';
};

export type CalendarBatchSyncResult = {
  total: number;
  synced: number;
  removed: number;
  skipped: number;
  failed: number;
};

/**
 * Calendar writes and the task-to-event mapping are a single serialized queue.
 * Without this, bulk-created tasks can all read the same mapping and overwrite
 * one another when their event IDs are saved.
 */
let calendarWriteQueue: Promise<void> = Promise.resolve();

function enqueueCalendarWrite<T>(operation: () => Promise<T>): Promise<T> {
  const result = calendarWriteQueue.then(operation, operation);
  calendarWriteQueue = result.then(
    () => undefined,
    () => undefined
  );
  return result;
}

async function getEventMapping(): Promise<Record<string, string>> {
  try {
    const key = eventMappingKey();
    const data = await AsyncStorage.getItem(key);
    if (data) return JSON.parse(data);

    // One-time migration from the original device-wide SecureStore mapping.
    // The later per-user SecureStore key used a colon, which SecureStore
    // rejects, so valid mappings can only exist under this legacy key.
    const legacyData = await secureStorage.getItem(LEGACY_EVENT_MAPPING_KEY);
    if (!legacyData) return {};
    await AsyncStorage.setItem(key, legacyData);
    await secureStorage.removeItem(LEGACY_EVENT_MAPPING_KEY);
    return JSON.parse(legacyData);
  } catch {
    return {};
  }
}

async function saveEventMapping(mapping: Record<string, string>): Promise<boolean> {
  try {
    await AsyncStorage.setItem(eventMappingKey(), JSON.stringify(mapping));
    return true;
  } catch (error) {
    console.error('Failed to save calendar event mapping:', error);
    return false;
  }
}

function isCalendarWritable(calendar: Calendar.Calendar): boolean {
  return (
    calendar.allowsModifications ||
    calendar.accessLevel === Calendar.CalendarAccessLevel.OWNER ||
    calendar.accessLevel === Calendar.CalendarAccessLevel.CONTRIBUTOR
  );
}

async function selectedCalendarIsAvailable(calendarId: string): Promise<boolean> {
  try {
    const calendars = await Calendar.getCalendarsAsync(Calendar.EntityTypes.EVENT);
    const selected = calendars.find((calendar) => calendar.id === calendarId);
    return Boolean(selected && isCalendarWritable(selected));
  } catch (error) {
    console.error('Failed to validate selected calendar:', error);
    return false;
  }
}

async function findUnmappedExistingEvent(
  calendarId: string,
  title: string,
  startDate: Date,
  endDate: Date,
  mapping: Record<string, string>
): Promise<string | undefined> {
  try {
    const events = await Calendar.getEventsAsync(
      [calendarId],
      new Date(startDate.getTime() - EXISTING_EVENT_TIME_TOLERANCE_MS),
      new Date(endDate.getTime() + EXISTING_EVENT_TIME_TOLERANCE_MS)
    );
    const mappedEventIds = new Set(Object.values(mapping));
    const matches = events.filter((event) => {
      const eventStart = new Date(event.startDate).getTime();
      return (
        event.id &&
        !mappedEventIds.has(event.id) &&
        event.title === title &&
        Math.abs(eventStart - startDate.getTime()) <= EXISTING_EVENT_TIME_TOLERANCE_MS
      );
    });
    return matches.length === 1 ? matches[0]?.id : undefined;
  } catch (error) {
    if (__DEV__) console.warn('[calendar-sync] existing event recovery failed', error);
    return undefined;
  }
}

export async function validateCalendarConnection(): Promise<
  'ready' | 'not_connected' | 'permission_denied' | 'calendar_unavailable'
> {
  const calendarId = useAppStore.getState().syncCalendarId;
  if (!calendarId) return 'not_connected';

  try {
    const { status } = await Calendar.getCalendarPermissionsAsync();
    if (status !== 'granted') return 'permission_denied';
  } catch (error) {
    console.error('Failed to check calendar permission:', error);
    return 'permission_denied';
  }

  return (await selectedCalendarIsAvailable(calendarId)) ? 'ready' : 'calendar_unavailable';
}

async function removeMappedEvent(
  taskId: string,
  mapping: Record<string, string>
): Promise<boolean> {
  const eventId = mapping[taskId];
  if (!eventId) return true;

  try {
    await Calendar.getEventAsync(eventId);
  } catch {
    // A missing event is already in the desired state.
    delete mapping[taskId];
    return saveEventMapping(mapping);
  }

  try {
    await Calendar.deleteEventAsync(eventId);
  } catch (error) {
    console.error('Failed to delete calendar event:', error);
    return false;
  }
  delete mapping[taskId];
  return saveEventMapping(mapping);
}

async function syncTaskToCalendarNow(task: Task): Promise<CalendarSyncResult> {
  const calendarId = useAppStore.getState().syncCalendarId;
  if (!calendarId) {
    return { taskId: task._id, status: 'skipped', reason: 'not_connected' };
  }

  const mapping = await getEventMapping();
  let existingEventId: string | undefined = mapping[task._id];
  if ((task.done || !task.dueAt) && !existingEventId) {
    return {
      taskId: task._id,
      status: 'skipped',
      reason: task.done ? 'completed' : 'no_due_date',
    };
  }

  const connection = await validateCalendarConnection();
  if (connection !== 'ready') {
    return {
      taskId: task._id,
      status: 'failed',
      reason: connection === 'permission_denied' ? 'permission_denied' : 'calendar_unavailable',
    };
  }

  if (task.done || !task.dueAt) {
    const removed = await removeMappedEvent(task._id, mapping);
    return removed
      ? {
          taskId: task._id,
          status: existingEventId ? 'removed' : 'skipped',
          reason: task.done ? 'completed' : 'no_due_date',
        }
      : { taskId: task._id, status: 'failed', reason: 'write_failed' };
  }

  const startDate = new Date(task.dueAt);
  if (Number.isNaN(startDate.getTime())) {
    return { taskId: task._id, status: 'failed', reason: 'write_failed' };
  }
  const endDate = new Date(startDate.getTime() + 60 * 60 * 1000);
  const eventDetails = {
    title: `Bobble: ${task.title}`,
    startDate,
    endDate,
    notes: task.notes || 'Synced from Bobble',
    alarms: [{ relativeOffset: -15 }],
  };

  if (!existingEventId) {
    const recoveredEventId = await findUnmappedExistingEvent(
      calendarId,
      eventDetails.title,
      startDate,
      endDate,
      mapping
    );
    if (recoveredEventId) {
      mapping[task._id] = recoveredEventId;
      if (!(await saveEventMapping(mapping))) {
        return { taskId: task._id, status: 'failed', reason: 'write_failed' };
      }
      existingEventId = recoveredEventId;
    }
  }

  if (existingEventId) {
    try {
      const existingEvent = await Calendar.getEventAsync(existingEventId);
      if (existingEvent.calendarId !== calendarId) {
        // The user selected a different calendar. Remove the old event and
        // recreate it in the newly selected calendar.
        if (!(await removeMappedEvent(task._id, mapping))) {
          return { taskId: task._id, status: 'failed', reason: 'write_failed' };
        }
        existingEventId = undefined;
      }
    } catch {
      delete mapping[task._id];
      await saveEventMapping(mapping);
      existingEventId = undefined;
    }
  }

  try {
    if (existingEventId) {
      await Calendar.updateEventAsync(existingEventId, eventDetails);
    } else {
      const eventId = await Calendar.createEventAsync(calendarId, eventDetails);
      mapping[task._id] = eventId;
      if (!(await saveEventMapping(mapping))) {
        return { taskId: task._id, status: 'failed', reason: 'write_failed' };
      }
    }
    return { taskId: task._id, status: 'synced' };
  } catch (error) {
    console.error('Failed to sync task to calendar:', error);
    return { taskId: task._id, status: 'failed', reason: 'write_failed' };
  }
}

export function syncTaskToCalendar(task: Task): Promise<CalendarSyncResult> {
  return enqueueCalendarWrite(() => syncTaskToCalendarNow(task));
}

export async function syncTasksToCalendar(tasks: Task[]): Promise<CalendarBatchSyncResult> {
  const summary: CalendarBatchSyncResult = {
    total: tasks.length,
    synced: 0,
    removed: 0,
    skipped: 0,
    failed: 0,
  };

  for (const task of tasks) {
    const result = await syncTaskToCalendar(task);
    summary[result.status] += 1;
  }

  return summary;
}

/** Reconcile every incomplete task with a due date against the selected calendar. */
export async function resyncAllTasksToCalendar(): Promise<CalendarBatchSyncResult> {
  const calendarId = useAppStore.getState().syncCalendarId;
  if (!calendarId) {
    return { total: 0, synced: 0, removed: 0, skipped: 0, failed: 0 };
  }

  const tasks = await tasksApi.listTasks('all');
  const eligible = tasks.filter((task) => !task.done && task.dueAt);
  const tasksById = new Map(tasks.map((task) => [task._id, task]));
  const mapping = await enqueueCalendarWrite(() => getEventMapping());
  const staleTaskIds = Object.keys(mapping).filter((taskId) => {
    const task = tasksById.get(taskId);
    return !task || task.done || !task.dueAt;
  });

  for (const taskId of staleTaskIds) {
    const result = await removeTaskFromCalendar(taskId);
    if (__DEV__ && result.status === 'failed') {
      console.warn('[calendar-sync] failed to remove stale calendar event', result);
    }
  }

  return syncTasksToCalendar(eligible);
}

export function removeTaskFromCalendar(taskId: string): Promise<CalendarSyncResult> {
  return enqueueCalendarWrite(async () => {
    const mapping = await getEventMapping();
    const hadMapping = Boolean(mapping[taskId]);
    if (!hadMapping) return { taskId, status: 'skipped' };

    try {
      const { status } = await Calendar.getCalendarPermissionsAsync();
      if (status !== 'granted') {
        return { taskId, status: 'failed', reason: 'permission_denied' };
      }
    } catch {
      return { taskId, status: 'failed', reason: 'permission_denied' };
    }

    const removed = await removeMappedEvent(taskId, mapping);
    return removed
      ? { taskId, status: 'removed' }
      : { taskId, status: 'failed', reason: 'write_failed' };
  });
}
