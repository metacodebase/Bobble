import type { TaskItem } from '@/src/data/demo-data';
import type { Task, TaskFilterParam } from '@/src/features/tasks/types';

type TaskGroup = TaskItem['group'];

function startOfDay(date: Date): number {
  const d = new Date(date);
  d.setHours(0, 0, 0, 0);
  return d.getTime();
}

function deriveGroup(dueAt?: string | null): TaskGroup {
  if (!dueAt) return 'upcoming';

  const due = startOfDay(new Date(dueAt));
  const today = startOfDay(new Date());
  const oneDay = 24 * 60 * 60 * 1000;

  if (due < today) return 'overdue';
  if (due === today) return 'today';
  if (due === today + oneDay) return 'tomorrow';
  return 'upcoming';
}

function isTodayFilterMatch(dueAt?: string | null): boolean {
  const group = deriveGroup(dueAt);
  return group === 'today' || group === 'overdue';
}

function formatTime(dueAt?: string | null): string {
  if (!dueAt) return '';
  const date = new Date(dueAt);
  if (Number.isNaN(date.getTime())) return '';
  return date.toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' });
}

export function mapTaskToItem(task: Task): TaskItem {
  return {
    id: task._id,
    title: task.title,
    time: formatTime(task.dueAt),
    done: task.done,
    group: deriveGroup(task.dueAt),
    notes: task.notes,
  };
}

/** Filter by the device's local calendar day (not the server timezone). */
export function filterTasksByParam(tasks: Task[], filter: TaskFilterParam): Task[] {
  switch (filter) {
    case 'overdue':
      return tasks.filter((task) => deriveGroup(task.dueAt) === 'overdue');
    case 'today':
      return tasks.filter((task) => isTodayFilterMatch(task.dueAt));
    case 'upcoming':
      return tasks.filter((task) => !isTodayFilterMatch(task.dueAt));
    case 'done':
      return tasks.filter((task) => task.done);
    default:
      return tasks;
  }
}

const GROUP_ORDER: { label: string; key: TaskGroup }[] = [
  { label: 'Overdue', key: 'overdue' },
  { label: 'Today', key: 'today' },
  { label: 'Tomorrow', key: 'tomorrow' },
  { label: 'Upcoming', key: 'upcoming' },
];

export function buildTaskSections(
  tasks: Task[]
): { label: string; tasks: TaskItem[] }[] {
  const items = tasks.map(mapTaskToItem);
  return GROUP_ORDER.map(({ label, key }) => ({
    label,
    tasks: items.filter((item) => item.group === key),
  })).filter((section) => section.tasks.length > 0);
}
