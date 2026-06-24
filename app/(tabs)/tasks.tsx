import { useState } from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Settings } from 'lucide-react-native';

import { TaskSection } from '@/src/components/tasks/task-section';
import { FAB_BOTTOM_OFFSET, FAB_SCROLL_CLEARANCE, FabButton } from '@/src/components/ui/fab-button';
import { FilterChips } from '@/src/components/ui/filter-chips';
import { ScreenHeader } from '@/src/components/ui/screen-header';
import { DEMO_TASKS, filterTasks, TaskFilter, TASK_FILTERS } from '@/src/data/demo-data';
import { useBobbleColors } from '@/src/hooks/use-bobble-colors';

export default function TasksScreen() {
  const insets = useSafeAreaInsets();
  const colors = useBobbleColors();
  const [filter, setFilter] = useState<TaskFilter>('All');
  const [tasks, setTasks] = useState(DEMO_TASKS);
  const sections = filterTasks(filter).map((section) => ({
    ...section,
    tasks: section.tasks.map(
      (task) => tasks.find((t) => t.id === task.id) ?? task,
    ),
  }));

  const handleToggle = (id: string) => {
    setTasks((prev) =>
      prev.map((task) => (task.id === id ? { ...task, done: !task.done } : task)),
    );
  };

  return (
    <View style={[styles.root, { paddingTop: insets.top + 12, backgroundColor: colors.background }]}>
      <View style={styles.header}>
        <ScreenHeader title="Tasks" rightIcon={Settings} />
        <FilterChips options={TASK_FILTERS} active={filter} onChange={setFilter} />
      </View>

      <ScrollView
        contentContainerStyle={[styles.scroll, { paddingBottom: FAB_SCROLL_CLEARANCE }]}
        showsVerticalScrollIndicator={false}
      >
        {sections.map((section) => (
          <TaskSection
            key={section.label}
            label={section.label}
            tasks={section.tasks}
            onToggle={handleToggle}
          />
        ))}
      </ScrollView>

      <FabButton bottom={FAB_BOTTOM_OFFSET} onPress={() => {}} />
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
});
