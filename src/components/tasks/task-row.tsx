import { CalendarDays, Check, Clock, MoreHorizontal, Trash2 } from 'lucide-react-native';
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
  const DueIcon = task.group === 'today' ? Clock : CalendarDays;

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
    <View style={styles.cardContainer}>
      <View style={[styles.row, { backgroundColor: colors.surface }]}>
        <Pressable
          onPress={onToggle}
          hitSlop={8}
          style={[
            styles.checkbox,
            { borderColor: colors.primaryLight },
            task.done && { backgroundColor: colors.primaryLight, borderColor: colors.primaryLight },
          ]}
        >
          {task.done ? <Check size={16} color={colors.textOnPrimary} strokeWidth={3} /> : null}
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
          {task.time ? (
            <View style={styles.timeRow}>
              <DueIcon size={13} color={colors.primaryLight} />
              <Text style={[styles.time, { color: colors.primaryLight }]}>{task.time}</Text>
            </View>
          ) : null}
        </Pressable>
        <Pressable onPress={onPress} hitSlop={8}>
          <MoreHorizontal size={20} color={colors.primaryLight} />
        </Pressable>
      </View>
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
  cardContainer: {
    shadowColor: '#9F52F2',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.06,
    shadowRadius: 12,
    elevation: 2,
    backgroundColor: 'transparent',
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
    padding: 16,
    borderRadius: 16,
  },
  checkbox: {
    width: 28,
    height: 28,
    borderRadius: 8,
    borderWidth: 1.5,
    alignItems: 'center',
    justifyContent: 'center',
  },
  content: {
    flex: 1,
    gap: 4,
  },
  title: {
    ...Typography.body,
    fontSize: 16,
    fontFamily: Typography.button.fontFamily,
  },
  timeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  time: {
    ...Typography.caption,
  },
  deleteAction: {
    justifyContent: 'center',
    alignItems: 'center',
    width: 88,
    gap: 4,
    borderRadius: 16,
    marginVertical: 1,
    marginLeft: 8,
  },
  deleteText: {
    ...Typography.caption,
  },
});
