import { StyleSheet, Text, View } from 'react-native';

import { TaskRow } from '@/src/components/tasks/task-row';
import { TaskItem } from '@/src/data/demo-data';
import { useBobbleColors } from '@/src/hooks/use-bobble-colors';
import { useNightForeground } from '@/src/hooks/use-night-foreground';
import { Typography } from '@/src/theme/fonts';

type TaskSectionProps = {
  label: string;
  tasks: TaskItem[];
  onToggle?: (id: string) => void;
  onPress?: (id: string) => void;
  onDelete?: (id: string) => void;
};

export function TaskSection({ label, tasks, onToggle, onPress, onDelete }: TaskSectionProps) {
  const colors = useBobbleColors();
  const night = useNightForeground();

  return (
    <View style={styles.section}>
      <View style={styles.headerRow}>
        <Text style={[styles.label, { color: night.text ?? colors.text }]}>
          {label} ({tasks.length})
        </Text>
        <View style={[styles.line, { backgroundColor: colors.primaryMuted, opacity: 0.3 }]} />
      </View>
      <View style={styles.list}>
        {tasks.map((task) => (
          <TaskRow
            key={task.id}
            task={task}
            onToggle={() => onToggle?.(task.id)}
            onPress={onPress ? () => onPress(task.id) : undefined}
            onDelete={onDelete ? () => onDelete(task.id) : undefined}
          />
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  section: {
    marginBottom: 24,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
    gap: 12,
  },
  label: {
    ...Typography.formLabel,
    fontSize: 15,
  },
  line: {
    flex: 1,
    height: 1,
  },
  list: {
    gap: 12,
  },
});
