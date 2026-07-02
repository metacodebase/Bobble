import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

import { tasksApi } from '@/src/api';
import type {
  CreateTaskBody,
  CreateTasksBulkBody,
  Task,
  TaskFilterParam,
  UpdateTaskBody,
} from '@/src/features/tasks/types';
import { queryKeys } from '@/src/services/query-keys';
import { useAppStore } from '@/src/store/app-store';
import { getApiErrorMessage } from '@/src/utils/api-error';
import { toast } from '@/src/utils/toast';

export function useTasks(filter: TaskFilterParam = 'all', enabled = true) {
  const isAuthenticated = useAppStore((s) => s.isAuthenticated);
  return useQuery({
    queryKey: queryKeys.tasks.list(filter),
    queryFn: () => tasksApi.listTasks(filter),
    enabled: enabled && isAuthenticated,
    staleTime: 30_000,
  });
}

export function useCreateTask() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (body: CreateTaskBody) => tasksApi.createTask(body),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: queryKeys.tasks.all });
    },
    onError: (e) => toast.error(getApiErrorMessage(e, 'Could not create task')),
  });
}

export function useCreateTasksBulk() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (body: CreateTasksBulkBody) => tasksApi.createTasksBulk(body),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: queryKeys.tasks.all });
    },
    onError: (e) => toast.error(getApiErrorMessage(e, 'Could not save tasks')),
  });
}

export function useUpdateTask() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, body }: { id: string; body: UpdateTaskBody }) =>
      tasksApi.updateTask(id, body),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: queryKeys.tasks.all });
    },
    onError: (e) => toast.error(getApiErrorMessage(e, 'Could not update task')),
  });
}

type TasksSnapshot = [readonly unknown[], Task[] | undefined][];

export function useToggleTask() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => tasksApi.toggleTask(id),
    onMutate: async (id: string) => {
      await qc.cancelQueries({ queryKey: queryKeys.tasks.all });
      const snapshot = qc.getQueriesData<Task[]>({ queryKey: queryKeys.tasks.all });
      qc.setQueriesData<Task[]>({ queryKey: queryKeys.tasks.all }, (prev) =>
        prev?.map((task) => (task._id === id ? { ...task, done: !task.done } : task)),
      );
      return { snapshot } as { snapshot: TasksSnapshot };
    },
    onError: (e, _id, context) => {
      context?.snapshot.forEach(([key, data]) => qc.setQueryData(key, data));
      toast.error(getApiErrorMessage(e, 'Could not update task'));
    },
    onSuccess: (updated: Task) => {
      qc.setQueriesData<Task[]>({ queryKey: queryKeys.tasks.all }, (prev) =>
        prev?.map((task) => (task._id === updated._id ? updated : task)),
      );
    },
    onSettled: () => {
      qc.invalidateQueries({ queryKey: queryKeys.tasks.all });
    },
  });
}

export function useDeleteTask() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => tasksApi.deleteTask(id),
    onMutate: async (id: string) => {
      await qc.cancelQueries({ queryKey: queryKeys.tasks.all });
      const snapshot = qc.getQueriesData<Task[]>({ queryKey: queryKeys.tasks.all });
      qc.setQueriesData<Task[]>({ queryKey: queryKeys.tasks.all }, (prev) =>
        prev?.filter((task) => task._id !== id),
      );
      return { snapshot } as { snapshot: TasksSnapshot };
    },
    onError: (e, _id, context) => {
      context?.snapshot.forEach(([key, data]) => qc.setQueryData(key, data));
      toast.error(getApiErrorMessage(e, 'Could not delete task'));
    },
    onSettled: () => {
      qc.invalidateQueries({ queryKey: queryKeys.tasks.all });
    },
  });
}
