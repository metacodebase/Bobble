import { Check } from 'lucide-react-native';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { TaskItem } from '@/src/data/demo-data';
import { BobbleColors } from '@/src/theme/colors';
import { Typography } from '@/src/theme/fonts';

type TaskRowProps = {
  task: TaskItem;
  onToggle?: () => void;
};

export function TaskRow({ task, onToggle }: TaskRowProps) {
  return (
    <Pressable onPress={onToggle} style={({ pressed }) => [styles.row, pressed && styles.pressed]}>
      <View style={[styles.checkbox, task.done && styles.checkboxDone]}>
        {task.done ? <Check size={14} color={BobbleColors.textOnPrimary} strokeWidth={3} /> : null}
      </View>
      <View style={styles.content}>
        <Text style={[styles.title, task.done && styles.titleDone]} numberOfLines={1}>
          {task.title}
        </Text>
        <Text style={styles.time}>{task.time}</Text>
      </View>
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
    borderBottomColor: BobbleColors.border,
  },
  pressed: {
    opacity: 0.85,
  },
  checkbox: {
    width: 24,
    height: 24,
    borderRadius: 8,
    borderWidth: 2,
    borderColor: BobbleColors.border,
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkboxDone: {
    backgroundColor: BobbleColors.primary,
    borderColor: BobbleColors.primary,
  },
  content: {
    flex: 1,
    gap: 2,
  },
  title: {
    ...Typography.body,
    fontFamily: Typography.button.fontFamily,
    color: BobbleColors.text,
  },
  titleDone: {
    textDecorationLine: 'line-through',
    color: BobbleColors.textSecondary,
  },
  time: {
    ...Typography.caption,
    color: BobbleColors.textSecondary,
  },
});
