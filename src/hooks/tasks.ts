import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { Href, router } from 'expo-router';
import { useEffect } from 'react';

import { tasksApi } from '@/src/api';
import { filterTasksByParam } from '@/src/features/tasks/adapter';
import type {
  CreateTaskBody,
  CreateTasksBulkBody,
  Task,
  TaskFilterParam,
  UpdateTaskBody,
} from '@/src/features/tasks/types';
import { queryKeys } from '@/src/services/query-keys';
import { removeTaskFromCalendar, syncTaskToCalendar } from '@/src/services/calendar-sync';
import { syncTaskWidgets } from '@/src/services/widget-sync';
import { useAppStore } from '@/src/store/app-store';
import { getApiErrorMessage, isProLimitError } from '@/src/utils/api-error';
import { toast } from '@/src/utils/toast';

type QueryClient = ReturnType<typeof useQueryClient>;

function invalidateUserStats(qc: QueryClient) {
  void qc.invalidateQueries({ queryKey: queryKeys.auth.me });
  void qc.invalidateQueries({ queryKey: queryKeys.profile.all });
}

function invalidateMindMap(qc: QueryClient) {
  void qc.invalidateQueries({ queryKey: queryKeys.mindMap.all });
}

function handleTaskLimitError(error: unknown, fallback: string) {
  if (isProLimitError(error)) {
    toast.error(getApiErrorMessage(error, fallback));
    router.push('/paywall' as Href);
    return;
  }
  toast.error(getApiErrorMessage(error, fallback));
}

export function useTasks(filter: TaskFilterParam = 'all', enabled = true) {
  const isAuthenticated = useAppStore((s) => s.isAuthenticated);
  const isGuest = useAppStore((s) => s.isGuest);
  const query = useQuery({
    queryKey: queryKeys.tasks.list(filter),
    queryFn: () => tasksApi.listTasks(filter),
    enabled: enabled && (isAuthenticated || isGuest),
    staleTime: 30_000,
  });

  // Keep the home-screen widgets in sync with today's tasks.
  const { data } = query;
  useEffect(() => {
    if (!data) return;
    if (filter !== 'today' && filter !== 'all') return;
    void syncTaskWidgets(filter === 'today' ? data : filterTasksByParam(data, 'today'));
  }, [data, filter]);

  return query;
}

export function useCreateTask() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (body: CreateTaskBody) => tasksApi.createTask(body),
    onSuccess: (task) => {
      qc.invalidateQueries({ queryKey: queryKeys.tasks.all });
      invalidateUserStats(qc);
      if (task.bobble) invalidateMindMap(qc);
      void syncTaskToCalendar(task);
    },
    onError: (e) => handleTaskLimitError(e, 'Could not create task'),
  });
}

export function useCreateTasksBulk() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (body: CreateTasksBulkBody) => tasksApi.createTasksBulk(body),
    onSuccess: (tasks) => {
      qc.invalidateQueries({ queryKey: queryKeys.tasks.all });
      invalidateUserStats(qc);
      if (tasks.some((task) => task.bobble)) invalidateMindMap(qc);
      tasks.forEach((task) => void syncTaskToCalendar(task));
    },
    onError: (e) => handleTaskLimitError(e, 'Could not save tasks'),
  });
}

export function useUpdateTask() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, body }: { id: string; body: UpdateTaskBody }) =>
      tasksApi.updateTask(id, body),
    onSuccess: (task) => {
      qc.invalidateQueries({ queryKey: queryKeys.tasks.all });
      invalidateUserStats(qc);
      void syncTaskToCalendar(task);
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
      void syncTaskToCalendar(updated);
    },
    onSettled: () => {
      qc.invalidateQueries({ queryKey: queryKeys.tasks.all });
      invalidateUserStats(qc);
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
    onSettled: (_data, _error, id) => {
      qc.invalidateQueries({ queryKey: queryKeys.tasks.all });
      invalidateUserStats(qc);
      void removeTaskFromCalendar(id);
    },
  });
}
