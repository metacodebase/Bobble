import { API } from '@/src/api/endpoints';
import { filterTasksByParam } from '@/src/features/tasks/adapter';
import type {
  CreateTaskBody,
  CreateTasksBulkBody,
  Task,
  TaskFilterParam,
  UpdateTaskBody,
} from '@/src/features/tasks/types';
import { api, buildQueryString, unwrap } from '@/src/services/api';
import { offlineTasks } from '@/src/services/offline';
import { shouldUseOfflineData } from '@/src/services/offline/mode';

export async function listTasks(filter: TaskFilterParam = 'all'): Promise<Task[]> {
  if (shouldUseOfflineData()) return offlineTasks.listTasks(filter);
  // Fetch all, then filter on-device so "today"/"upcoming" match the user's local day.
  const qs = buildQueryString({ filter: 'all' });
  const res = await api.get<Task[]>(`${API.tasks.root}${qs}`);
  return filterTasksByParam(unwrap(res), filter);
}

export async function createTask(body: CreateTaskBody): Promise<Task> {
  if (shouldUseOfflineData()) return offlineTasks.createTask(body);
  const res = await api.post<Task, CreateTaskBody>(API.tasks.root, body);
  return unwrap(res);
}

export async function createTasksBulk(body: CreateTasksBulkBody): Promise<Task[]> {
  if (shouldUseOfflineData()) return offlineTasks.createTasksBulk(body);
  const res = await api.post<Task[], CreateTasksBulkBody>(API.tasks.bulk, body);
  return unwrap(res);
}

export async function updateTask(id: string, body: UpdateTaskBody): Promise<Task> {
  if (shouldUseOfflineData()) return offlineTasks.updateTask(id, body);
  const res = await api.patch<Task, UpdateTaskBody>(API.tasks.byId(id), body);
  return unwrap(res);
}

export async function toggleTask(id: string): Promise<Task> {
  if (shouldUseOfflineData()) return offlineTasks.toggleTask(id);
  const res = await api.patch<Task, Record<string, never>>(API.tasks.toggle(id), {});
  return unwrap(res);
}

export async function deleteTask(id: string): Promise<{ id: string }> {
  if (shouldUseOfflineData()) return offlineTasks.deleteTask(id);
  const res = await api.delete<{ id: string }>(API.tasks.byId(id));
  return unwrap(res);
}
