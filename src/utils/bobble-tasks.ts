import type { Bobble, SuggestedTask } from '@/src/features/bobbles/types';
import type { CreateTasksBulkBody } from '@/src/features/tasks/types';
import { normalizeSuggestedTasks } from '@/src/utils/suggested-tasks';

function suggestedTasksFromBobble(bobble: Bobble): SuggestedTask[] {
  const tasks = normalizeSuggestedTasks(bobble.suggestedTasks ?? []);
  if (tasks.length > 0) return tasks;

  const titles = new Set<string>();
  for (const bullet of bobble.summary?.bullets ?? []) {
    const value = bullet.value?.trim();
    if (value) titles.add(value);
  }

  return Array.from(titles).map((title) => ({ title }));
}

/** Collect actionable tasks from a bobble's AI output. */
export function tasksFromBobble(bobble: Bobble): SuggestedTask[] {
  return suggestedTasksFromBobble(bobble);
}

/** @deprecated Use tasksFromBobble — titles only, no deadlines. */
export function taskTitlesFromBobble(bobble: Bobble): string[] {
  return tasksFromBobble(bobble).map((task) => task.title);
}

export function buildTasksBulkFromBobble(bobble: Bobble): CreateTasksBulkBody {
  return {
    bobble: bobble._id,
    tasks: tasksFromBobble(bobble).map((task) => ({
      title: task.title,
      dueAt: task.dueAt ?? null,
      bobble: bobble._id,
    })),
  };
}
