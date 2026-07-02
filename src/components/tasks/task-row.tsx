import { Check, Trash2 } from 'lucide-react-native';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { TaskItem } from '@/src/data/demo-data';
import { useBobbleColors } from '@/src/hooks/use-bobble-colors';
import { Typography } from '@/src/theme/fonts';

type TaskRowProps = {
  task: TaskItem;
  onToggle?: () => void;
  onDelete?: () => void;
};

export function TaskRow({ task, onToggle, onDelete }: TaskRowProps) {
  const colors = useBobbleColors();

  return (
    <Pressable
      onPress={onToggle}
      style={({ pressed }) => [
        styles.row,
        { borderBottomColor: colors.border },
        pressed && styles.pressed,
      ]}
    >
      <View
        style={[
          styles.checkbox,
          { borderColor: colors.border },
          task.done && { backgroundColor: colors.primary, borderColor: colors.primary },
        ]}
      >
        {task.done ? <Check size={14} color={colors.textOnPrimary} strokeWidth={3} /> : null}
      </View>
      <View style={styles.content}>
        <Text
          style={[
            styles.title,
            { color: colors.text },
            task.done && { textDecorationLine: 'line-through', color: colors.textSecondary },
          ]}
          numberOfLines={1}
        >
          {task.title}
        </Text>
        {task.time ? (
          <Text style={[styles.time, { color: colors.textSecondary }]}>{task.time}</Text>
        ) : null}
      </View>
      {onDelete ? (
        <Pressable
          onPress={onDelete}
          hitSlop={8}
          style={({ pressed }) => [styles.deleteButton, pressed && styles.pressed]}
        >
          <Trash2 size={18} color={colors.textSecondary} strokeWidth={2} />
        </Pressable>
      ) : null}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingVertical: 12,
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  pressed: {
    opacity: 0.85,
  },
  checkbox: {
    width: 24,
    height: 24,
    borderRadius: 8,
    borderWidth: 2,
    alignItems: 'center',
    justifyContent: 'center',
  },
  content: {
    flex: 1,
    gap: 2,
  },
  deleteButton: {
    padding: 8,
  },
  title: {
    ...Typography.body,
    fontFamily: Typography.button.fontFamily,
  },
  time: {
    ...Typography.caption,
  },
});
