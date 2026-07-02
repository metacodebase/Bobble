import { useMemo, useState } from 'react';
import { ActivityIndicator, ScrollView, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Settings } from 'lucide-react-native';

import { AddTaskSheet } from '@/src/components/tasks/add-task-sheet';
import { TaskSection } from '@/src/components/tasks/task-section';
import { FAB_SIZE, FabButton } from '@/src/components/ui/fab-button';
import { FilterChips } from '@/src/components/ui/filter-chips';
import { ScreenHeader } from '@/src/components/ui/screen-header';
import { TaskFilter, TASK_FILTERS } from '@/src/data/demo-data';
import { buildTaskSections } from '@/src/features/tasks/adapter';
import type { TaskFilterParam } from '@/src/features/tasks/types';
import { useCreateTask, useDeleteTask, useTasks, useToggleTask } from '@/src/hooks/tasks';
import { useBobbleColors } from '@/src/hooks/use-bobble-colors';
import { useTabBarInsets } from '@/src/hooks/use-tab-bar-insets';

const FILTER_PARAM: Record<TaskFilter, TaskFilterParam> = {
  All: 'all',
  Today: 'today',
  Upcoming: 'upcoming',
  Done: 'done',
};

export default function TasksScreen() {
  const insets = useSafeAreaInsets();
  const colors = useBobbleColors();
  const { height: tabBarHeight } = useTabBarInsets();
  const fabBottom = tabBarHeight + 16;
  const [filter, setFilter] = useState<TaskFilter>('All');
  const [isAddOpen, setIsAddOpen] = useState(false);

  const { data: tasks = [], isLoading, isError } = useTasks(FILTER_PARAM[filter]);
  const createTask = useCreateTask();
  const toggleTask = useToggleTask();
  const deleteTask = useDeleteTask();

  const sections = useMemo(() => buildTaskSections(tasks), [tasks]);

  const handleCreate = ({ title, priority }: { title: string; priority: 'low' | 'medium' | 'high' }) => {
    createTask.mutate(
      { title, priority },
      { onSuccess: () => setIsAddOpen(false) },
    );
  };

  return (
    <View style={[styles.root, { paddingTop: insets.top + 12, backgroundColor: colors.background }]}>
      <View style={styles.header}>
        <ScreenHeader title="Tasks" rightIcon={Settings} />
        <FilterChips options={TASK_FILTERS} active={filter} onChange={setFilter} />
      </View>

      <ScrollView
        contentContainerStyle={[styles.scroll, { paddingBottom: fabBottom + FAB_SIZE + 16 }]}
        showsVerticalScrollIndicator={false}
      >
        {isLoading ? (
          <ActivityIndicator style={styles.state} color={colors.primary} />
        ) : isError ? (
          <Text style={[styles.stateText, { color: colors.textSecondary }]}>
            Could not load tasks. Pull to try again.
          </Text>
        ) : sections.length === 0 ? (
          <Text style={[styles.stateText, { color: colors.textSecondary }]}>
            No tasks yet. Tap + to add one.
          </Text>
        ) : (
          sections.map((section) => (
            <TaskSection
              key={section.label}
              label={section.label}
              tasks={section.tasks}
              onToggle={(id) => toggleTask.mutate(id)}
              onDelete={(id) => deleteTask.mutate(id)}
            />
          ))
        )}
      </ScrollView>

      <FabButton bottom={fabBottom} onPress={() => setIsAddOpen(true)} />

      <AddTaskSheet
        visible={isAddOpen}
        submitting={createTask.isPending}
        onClose={() => setIsAddOpen(false)}
        onSubmit={handleCreate}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    paddingHorizontal: 24,
  },
  header: {
    gap: 12,
    marginBottom: 8,
  },
  scroll: {
    paddingTop: 4,
  },
  state: {
    marginTop: 48,
  },
  stateText: {
    textAlign: 'center',
    marginTop: 48,
  },
});
