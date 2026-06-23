import { StyleSheet, Text, View } from 'react-native';

import { TaskRow } from '@/src/components/tasks/task-row';
import { TaskItem } from '@/src/data/demo-data';
import { useBobbleColors } from '@/src/hooks/use-bobble-colors';
import { Typography } from '@/src/theme/fonts';

type TaskSectionProps = {
  label: string;
  tasks: TaskItem[];
  onToggle?: (id: string) => void;
};

export function TaskSection({ label, tasks, onToggle }: TaskSectionProps) {
  const colors = useBobbleColors();

  return (
    <View style={styles.section}>
      <Text style={[styles.label, { color: colors.textSecondary }]}>
        {label} ({tasks.length})
      </Text>
      <View style={styles.list}>
        {tasks.map((task) => (
          <TaskRow key={task.id} task={task} onToggle={() => onToggle?.(task.id)} />
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  section: {
    marginBottom: 24,
  },
  label: {
    ...Typography.formLabel,
    fontSize: 15,
    marginBottom: 8,
  },
  list: {
    gap: 4,
  },
});
