import { DEMO_TASKS } from '@/src/data/demo-data';
import { filterTasksByParam } from '@/src/features/tasks/adapter';
import type {
  CreateTaskBody,
  CreateTasksBulkBody,
  Task,
  TaskFilterParam,
  UpdateTaskBody,
} from '@/src/features/tasks/types';

const OFFLINE_USER_ID = 'offline-demo-user';

function parseTimeOnDay(time: string, dayOffset: number): Date {
  const date = new Date();
  date.setHours(0, 0, 0, 0);
  date.setDate(date.getDate() + dayOffset);

  const match = time.match(/(\d+):(\d+)\s*(AM|PM)/i);
  if (!match) return date;

  let hours = Number(match[1]);
  const minutes = Number(match[2]);
  const meridiem = match[3].toUpperCase();

  if (meridiem === 'PM' && hours < 12) hours += 12;
  if (meridiem === 'AM' && hours === 12) hours = 0;

  date.setHours(hours, minutes, 0, 0);
  return date;
}

function groupToDayOffset(group: 'today' | 'tomorrow' | 'upcoming'): number {
  if (group === 'tomorrow') return 1;
  if (group === 'upcoming') return 7;
  return 0;
}

function toTask(
  item: (typeof DEMO_TASKS)[number],
  overrides: Partial<Task> = {},
): Task {
  const now = new Date().toISOString();
  const dueAt = parseTimeOnDay(item.time, groupToDayOffset(item.group)).toISOString();

  return {
    _id: item.id,
    user: OFFLINE_USER_ID,
    title: item.title,
    notes: item.notes,
    done: item.done,
    dueAt,
    priority: 'medium',
    createdAt: now,
    updatedAt: now,
    ...overrides,
  };
}

let taskStore: Task[] = DEMO_TASKS.map((item) => toTask(item));

function nextId(): string {
  return `offline-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
}

export async function listTasks(filter: TaskFilterParam = 'all'): Promise<Task[]> {
  return filterTasksByParam(taskStore, filter);
}

export async function createTask(body: CreateTaskBody): Promise<Task> {
  const now = new Date().toISOString();
  const task: Task = {
    _id: nextId(),
    user: OFFLINE_USER_ID,
    title: body.title,
    notes: body.notes,
    done: body.done ?? false,
    dueAt: body.dueAt ?? null,
    reminderAt: body.reminderAt ?? null,
    priority: body.priority ?? 'medium',
    bobble: body.bobble,
    createdAt: now,
    updatedAt: now,
  };
  taskStore = [task, ...taskStore];
  return task;
}

export async function createTasksBulk(body: CreateTasksBulkBody): Promise<Task[]> {
  const created = await Promise.all(body.tasks.map((task) => createTask({ ...task, bobble: body.bobble })));
  return created;
}

export async function updateTask(id: string, body: UpdateTaskBody): Promise<Task> {
  const index = taskStore.findIndex((task) => task._id === id);
  if (index === -1) throw new Error('Task not found');

  const updated: Task = {
    ...taskStore[index],
    ...body,
    updatedAt: new Date().toISOString(),
  };
  taskStore = taskStore.map((task) => (task._id === id ? updated : task));
  return updated;
}

export async function toggleTask(id: string): Promise<Task> {
  const task = taskStore.find((item) => item._id === id);
  if (!task) throw new Error('Task not found');
  return updateTask(id, { done: !task.done });
}

export async function deleteTask(id: string): Promise<{ id: string }> {
  taskStore = taskStore.filter((task) => task._id !== id);
  return { id };
}
