import type { Task } from '@/src/features/tasks/types';

/**
 * Storage key for the widget payload. Used for:
 * - AsyncStorage (read by the Android headless widget task handler)
 * - iOS App Group UserDefaults (read by the WidgetKit extension in targets/widget)
 */
export const WIDGET_PAYLOAD_KEY = 'bobbleWidgetPayload';

/** iOS App Group shared with the widget extension. Must match app.json entitlements and targets/widget/expo-target.config.js. */
export const IOS_APP_GROUP = 'group.metadots.bobble.app';

/** Deep link opened when a widget is tapped (expo-router path to the Tasks tab). */
export const WIDGET_DEEP_LINK = 'bobble:///tasks';

/**
 * Mascot mood shown on the widget. Mirrors the mascot progression of the
 * home screen's Today Progress card (see today-progress-card.tsx).
 */
export type WidgetMood = 'empty' | 'starting' | 'working' | 'almost' | 'done';

export interface WidgetPayload {
  /** Local calendar day (YYYY-MM-DD) this payload was computed for. Widgets treat other days as stale. */
  dayKey: string;
  total: number;
  completed: number;
  mood: WidgetMood;
  message: string;
  nextTaskTitle: string;
  nextTaskTime: string;
  updatedAt: string;
}

export function getLocalDayKey(date: Date = new Date()): string {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const d = String(date.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
}

function deriveMood(completed: number, total: number): WidgetMood {
  if (total <= 0) return 'empty';
  if (completed >= total) return 'done';
  if (completed === total - 1) return 'almost';
  if (completed > 0) return 'working';
  return 'starting';
}

function deriveMessage(mood: WidgetMood, completed: number, total: number): string {
  switch (mood) {
    case 'empty':
      return 'No tasks yet — record a Bobble!';
    case 'done':
      return 'All done for today!';
    case 'almost':
      return 'Just 1 task to go!';
    case 'working':
      return 'Keep the momentum going!';
    case 'starting':
      return total === 1 ? '1 task due today' : `${total} tasks due today`;
  }
}

function formatTime(dueAt?: string | null): string {
  if (!dueAt) return '';
  const date = new Date(dueAt);
  if (Number.isNaN(date.getTime())) return '';
  return date.toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' });
}

function findNextTask(todayTasks: Task[]): Task | undefined {
  const pending = todayTasks.filter((task) => !task.done);
  return pending.sort((a, b) => {
    if (!a.dueAt) return 1;
    if (!b.dueAt) return -1;
    return new Date(a.dueAt).getTime() - new Date(b.dueAt).getTime();
  })[0];
}

/** Build the widget snapshot from today's tasks (same set the home screen shows). */
export function buildWidgetPayload(todayTasks: Task[]): WidgetPayload {
  const total = todayTasks.length;
  const completed = todayTasks.filter((task) => task.done).length;
  const mood = deriveMood(completed, total);
  const nextTask = mood === 'done' || mood === 'empty' ? undefined : findNextTask(todayTasks);

  return {
    dayKey: getLocalDayKey(),
    total,
    completed,
    mood,
    message: deriveMessage(mood, completed, total),
    nextTaskTitle: nextTask?.title ?? '',
    nextTaskTime: formatTime(nextTask?.dueAt),
    updatedAt: new Date().toISOString(),
  };
}
