import * as Calendar from 'expo-calendar';

import { tasksApi } from '@/src/api';
import { secureStorage } from '@/src/services/secure-storage';
import { useAppStore } from '@/src/store/app-store';
import type { Task } from '@/src/features/tasks/types';

const EVENT_MAPPING_KEY = 'calendar-event-mapping';

/**
 * Gets the mapping of task IDs to calendar event IDs.
 */
async function getEventMapping(): Promise<Record<string, string>> {
  try {
    const data = await secureStorage.getItem(EVENT_MAPPING_KEY);
    return data ? JSON.parse(data) : {};
  } catch {
    return {};
  }
}

/**
 * Saves the mapping of task IDs to calendar event IDs.
 */
async function saveEventMapping(mapping: Record<string, string>) {
  try {
    await secureStorage.setItem(EVENT_MAPPING_KEY, JSON.stringify(mapping));
  } catch (error) {
    console.error('Failed to save event mapping:', error);
  }
}

/**
 * Syncs a task to the user's selected calendar.
 * If the task is done, it removes it from the calendar.
 * If the task has no due date, it also removes it.
 */
export async function syncTaskToCalendar(task: Task) {
  const syncCalendarId = useAppStore.getState().syncCalendarId;
  if (!syncCalendarId) return;

  const { status } = await Calendar.getCalendarPermissionsAsync();
  if (status !== 'granted') return;

  const mapping = await getEventMapping();
  const existingEventId = mapping[task._id];

  // If task is done or has no due date, remove it from calendar
  if (task.done || !task.dueAt) {
    if (existingEventId) {
      try {
        await Calendar.deleteEventAsync(existingEventId);
      } catch (e) {
        console.error('Failed to delete event:', e);
      }
      delete mapping[task._id];
      await saveEventMapping(mapping);
    }
    return;
  }

  const startDate = new Date(task.dueAt);
  // Default to 1 hour duration
  const endDate = new Date(startDate.getTime() + 60 * 60 * 1000);

  const eventDetails = {
    title: `Bobble: ${task.title}`,
    startDate,
    endDate,
    notes: task.notes || 'Synced from Bobble',
    alarms: [{ relativeOffset: -15 }], // 15 mins before
  };

  try {
    if (existingEventId) {
      await Calendar.updateEventAsync(existingEventId, eventDetails);
    } else {
      const eventId = await Calendar.createEventAsync(syncCalendarId, eventDetails);
      mapping[task._id] = eventId;
      await saveEventMapping(mapping);
    }
  } catch (error) {
    if (existingEventId) {
      // Stale mapping (e.g. user deleted the event in their calendar app) — recreate.
      try {
        delete mapping[task._id];
        const eventId = await Calendar.createEventAsync(syncCalendarId, eventDetails);
        mapping[task._id] = eventId;
        await saveEventMapping(mapping);
      } catch (retryError) {
        console.error('Failed to recreate calendar event:', retryError);
      }
    } else {
      console.error('Failed to sync task to calendar:', error);
    }
  }
}

/** Syncs multiple tasks to the connected calendar (no-op if calendar not connected). */
export async function syncTasksToCalendar(tasks: Task[]) {
  for (const task of tasks) {
    await syncTaskToCalendar(task);
  }
}

/**
 * Re-syncs all incomplete tasks with a due date to the connected calendar.
 * Repairs stale mappings when events were deleted externally.
 */
export async function resyncAllTasksToCalendar(): Promise<{ synced: number }> {
  const syncCalendarId = useAppStore.getState().syncCalendarId;
  if (!syncCalendarId) return { synced: 0 };

  const { status } = await Calendar.getCalendarPermissionsAsync();
  if (status !== 'granted') return { synced: 0 };

  const tasks = await tasksApi.listTasks('all');
  const eligible = tasks.filter((task) => !task.done && task.dueAt);
  await syncTasksToCalendar(eligible);
  return { synced: eligible.length };
}

/**
 * Removes a task from the calendar when it is deleted.
 */
export async function removeTaskFromCalendar(taskId: string) {
  const mapping = await getEventMapping();
  const existingEventId = mapping[taskId];

  if (existingEventId) {
    try {
      await Calendar.deleteEventAsync(existingEventId);
    } catch (e) {
      console.error('Failed to delete event:', e);
    }
    delete mapping[taskId];
    await saveEventMapping(mapping);
  }
}
