import { Calendar, CheckCircle, Clock } from 'lucide-react-native';
import { useMemo, useState } from 'react';
import { ActivityIndicator, RefreshControl, ScrollView, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { TaskFormSheet, TaskFormValues } from '@/src/components/tasks/task-form-sheet';
import { TaskSection } from '@/src/components/tasks/task-section';
import { FAB_SIZE, FabButton } from '@/src/components/ui/fab-button';
import { FilterChips } from '@/src/components/ui/filter-chips';
import { ScreenHeader } from '@/src/components/ui/screen-header';
import { TASK_FILTERS, TaskFilter } from '@/src/data/demo-data';
import { buildTaskSections } from '@/src/features/tasks/adapter';
import type { TaskFilterParam } from '@/src/features/tasks/types';
import {
  useCreateTask,
  useDeleteTask,
  useTasks,
  useToggleTask,
  useUpdateTask,
} from '@/src/hooks/tasks';
import { useBobbleColors } from '@/src/hooks/use-bobble-colors';
import { useNightForeground } from '@/src/hooks/use-night-foreground';
import { useTabBarInsets } from '@/src/hooks/use-tab-bar-insets';
import { Typography } from '@/src/theme/fonts';

const FILTER_PARAM: Record<TaskFilter, TaskFilterParam> = {
  All: 'all',
  Today: 'today',
  Upcoming: 'upcoming',
  Done: 'done',
};

type SheetState =
  | { mode: 'create' }
  | { mode: 'edit'; id: string; initial: Partial<TaskFormValues> };

export default function TasksScreen() {
  const insets = useSafeAreaInsets();
  const colors = useBobbleColors();
  const night = useNightForeground();
  const { height: tabBarHeight } = useTabBarInsets();
  const fabBottom = tabBarHeight + 16;
  const [filter, setFilter] = useState<TaskFilter>('All');
  const [sheet, setSheet] = useState<SheetState | null>(null);

  const { data: tasks = [], isLoading, isError, refetch, isRefetching } = useTasks(
    FILTER_PARAM[filter],
  );
  const createTask = useCreateTask();
  const updateTask = useUpdateTask();
  const toggleTask = useToggleTask();
  const deleteTask = useDeleteTask();

  const sections = useMemo(() => buildTaskSections(tasks), [tasks]);
  const isSubmitting = createTask.isPending || updateTask.isPending;

  const openEdit = (id: string) => {
    const task = tasks.find((t) => t._id === id);
    if (!task) return;
    setSheet({
      mode: 'edit',
      id,
      initial: {
        title: task.title,
        notes: task.notes,
        priority: task.priority,
        dueAt: task.dueAt ?? null,
      },
    });
  };

  const handleSubmit = (values: TaskFormValues) => {
    if (sheet?.mode === 'edit') {
      updateTask.mutate(
        { id: sheet.id, body: values },
        { onSuccess: () => setSheet(null) },
      );
    } else {
      createTask.mutate(values, { onSuccess: () => setSheet(null) });
    }
  };

  return (
    <View style={[styles.root, { paddingTop: insets.top + 12 }]}>
      <View style={styles.header}>
        <ScreenHeader title="Tasks" />
        <FilterChips 
          options={TASK_FILTERS} 
          active={filter} 
          onChange={setFilter}
          compact
          icons={{
            Today: Calendar,
            Upcoming: Clock,
            Done: CheckCircle,
          }}
        />
      </View>

      <ScrollView
        contentContainerStyle={[styles.scroll, { paddingBottom: fabBottom + FAB_SIZE + 16 }]}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={isRefetching}
            onRefresh={refetch}
            tintColor={colors.primary}
          />
        }
      >
        {isLoading ? (
          <View style={styles.state}>
            <ActivityIndicator color={colors.primary} />
            <Text style={[styles.stateText, { color: night.textSecondary ?? colors.textSecondary, marginTop: 0 }]}>
              Loading tasks…
            </Text>
          </View>
        ) : isError ? (
          <Text style={[styles.stateText, { color: night.textSecondary ?? colors.textSecondary }]}>
            Could not load tasks. Pull to refresh.
          </Text>
        ) : sections.length === 0 ? (
          <Text style={[styles.stateText, { color: night.textSecondary ?? colors.textSecondary }]}>
            No tasks yet. Tap + to add one.
          </Text>
        ) : (
          sections.map((section) => (
            <TaskSection
              key={section.label}
              label={section.label}
              tasks={section.tasks}
              onToggle={(id) => toggleTask.mutate(id)}
              onPress={openEdit}
              onDelete={(id) => deleteTask.mutate(id)}
            />
          ))
        )}
      </ScrollView>

      <FabButton bottom={fabBottom} onPress={() => setSheet({ mode: 'create' })} />

      <TaskFormSheet
        visible={sheet !== null}
        mode={sheet?.mode ?? 'create'}
        initial={sheet?.mode === 'edit' ? sheet.initial : undefined}
        submitting={isSubmitting}
        onClose={() => setSheet(null)}
        onSubmit={handleSubmit}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    paddingHorizontal: 16,
  },
  header: {
    gap: 12,
    marginBottom: 8,
    width: '100%',
    alignSelf: 'center',
  },
  scroll: {
    paddingTop: 4,
    width: '100%',
    alignSelf: 'center',
  },
  state: {
    marginTop: 48,
    alignItems: 'center',
    gap: 12,
  },
  stateText: {
    ...Typography.body,
    textAlign: 'center',
    marginTop: 48,
    width: '100%',
    alignSelf: 'center',
  },
});
