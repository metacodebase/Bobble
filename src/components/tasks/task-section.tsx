import { StyleSheet, Text, View } from 'react-native';

import { TaskItem } from '@/src/data/demo-data';
import { TaskRow } from '@/src/components/tasks/task-row';
import { BobbleColors } from '@/src/theme/colors';
import { Typography } from '@/src/theme/fonts';

type TaskSectionProps = {
  label: string;
  tasks: TaskItem[];
  onToggle?: (id: string) => void;
};

export function TaskSection({ label, tasks, onToggle }: TaskSectionProps) {
  return (
    <View style={styles.section}>
      <Text style={styles.label}>
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
    color: BobbleColors.textSecondary,
    marginBottom: 8,
  },
  list: {
    gap: 4,
  },
});
