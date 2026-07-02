import { Check, Trash2 } from 'lucide-react-native';
import { useRef } from 'react';
import { Alert, Pressable, StyleSheet, Text, View } from 'react-native';
import { Swipeable } from 'react-native-gesture-handler';

import { TaskItem } from '@/src/data/demo-data';
import { useBobbleColors } from '@/src/hooks/use-bobble-colors';
import { Typography } from '@/src/theme/fonts';

type TaskRowProps = {
  task: TaskItem;
  onToggle?: () => void;
  onPress?: () => void;
  onDelete?: () => void;
};

export function TaskRow({ task, onToggle, onPress, onDelete }: TaskRowProps) {
  const colors = useBobbleColors();
  const swipeableRef = useRef<Swipeable>(null);

  const confirmDelete = () => {
    if (!onDelete) return;
    Alert.alert('Delete task', `Delete "${task.title}"?`, [
      { text: 'Cancel', style: 'cancel', onPress: () => swipeableRef.current?.close() },
      {
        text: 'Delete',
        style: 'destructive',
        onPress: () => {
          swipeableRef.current?.close();
          onDelete();
        },
      },
    ]);
  };

  const renderRightActions = () => (
    <Pressable
      onPress={confirmDelete}
      style={[styles.deleteAction, { backgroundColor: colors.error }]}
    >
      <Trash2 size={20} color={colors.textOnPrimary} strokeWidth={2} />
      <Text style={[styles.deleteText, { color: colors.textOnPrimary }]}>Delete</Text>
    </Pressable>
  );

  const content = (
    <View style={[styles.row, { borderBottomColor: colors.border, backgroundColor: colors.background }]}>
      <Pressable
        onPress={onToggle}
        hitSlop={8}
        style={[
          styles.checkbox,
          { borderColor: colors.border },
          task.done && { backgroundColor: colors.primary, borderColor: colors.primary },
        ]}
      >
        {task.done ? <Check size={14} color={colors.textOnPrimary} strokeWidth={3} /> : null}
      </Pressable>
      <Pressable style={styles.content} onPress={onPress} disabled={!onPress}>
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
        {task.notes ? (
          <Text style={[styles.notes, { color: colors.textSecondary }]} numberOfLines={1}>
            {task.notes}
          </Text>
        ) : null}
        {task.time ? (
          <Text style={[styles.time, { color: colors.textSecondary }]}>{task.time}</Text>
        ) : null}
      </Pressable>
    </View>
  );

  if (!onDelete) return content;

  return (
    <Swipeable
      ref={swipeableRef}
      renderRightActions={renderRightActions}
      overshootRight={false}
      friction={2}
    >
      {content}
    </Swipeable>
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
  title: {
    ...Typography.body,
    fontFamily: Typography.button.fontFamily,
  },
  notes: {
    ...Typography.caption,
  },
  time: {
    ...Typography.caption,
  },
  deleteAction: {
    justifyContent: 'center',
    alignItems: 'center',
    width: 88,
    gap: 4,
  },
  deleteText: {
    ...Typography.caption,
  },
});
