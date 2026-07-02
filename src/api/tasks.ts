import { API } from '@/src/api/endpoints';
import type {
  CreateTaskBody,
  CreateTasksBulkBody,
  Task,
  TaskFilterParam,
  UpdateTaskBody,
} from '@/src/features/tasks/types';
import { api, buildQueryString, unwrap } from '@/src/services/api';

export async function listTasks(filter: TaskFilterParam = 'all'): Promise<Task[]> {
  const qs = buildQueryString({ filter });
  const res = await api.get<Task[]>(`${API.tasks.root}${qs}`);
  return unwrap(res);
}

export async function createTask(body: CreateTaskBody): Promise<Task> {
  const res = await api.post<Task, CreateTaskBody>(API.tasks.root, body);
  return unwrap(res);
}

export async function createTasksBulk(body: CreateTasksBulkBody): Promise<Task[]> {
  const res = await api.post<Task[], CreateTasksBulkBody>(API.tasks.bulk, body);
  return unwrap(res);
}

export async function updateTask(id: string, body: UpdateTaskBody): Promise<Task> {
  const res = await api.patch<Task, UpdateTaskBody>(API.tasks.byId(id), body);
  return unwrap(res);
}

export async function toggleTask(id: string): Promise<Task> {
  const res = await api.patch<Task, Record<string, never>>(API.tasks.toggle(id), {});
  return unwrap(res);
}

export async function deleteTask(id: string): Promise<{ id: string }> {
  const res = await api.delete<{ id: string }>(API.tasks.byId(id));
  return unwrap(res);
}
