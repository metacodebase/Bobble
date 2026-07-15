import { Image } from 'expo-image';
import { Check } from 'lucide-react-native';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { useBobbleColors } from '@/src/hooks/use-bobble-colors';
import { Typography } from '@/src/theme/fonts';

const SLEEP_MASCOT = require('@/src/assets/images/bobble-sleep.png');

export type FocusTask = {
  id: string;
  title: string;
  done: boolean;
};

type TodayFocusCardProps = {
  tasks?: FocusTask[];
  onToggle?: (id: string) => void;
  emptyMessage?: string;
};

export function TodayFocusCard({
  tasks = [],
  onToggle,
  emptyMessage = 'Record your first Bobble.',
}: TodayFocusCardProps) {
  const colors = useBobbleColors();
  const hasTasks = tasks.length > 0;

  return (
    <View
      style={[
        styles.card,
        {
          backgroundColor: colors.surface,
          borderColor: colors.border,
        },
      ]}
    >
      <Text style={[styles.title, { color: colors.primary }]}>Today's Focus</Text>

      {hasTasks ? (
        <View style={styles.list}>
          {tasks.map((task, index) => (
            <Pressable
              key={task.id}
              onPress={() => onToggle?.(task.id)}
              style={[
                styles.row,
                index < tasks.length - 1 && {
                  borderBottomWidth: StyleSheet.hairlineWidth,
                  borderBottomColor: colors.border,
                },
              ]}
            >
              <View
                style={[
                  styles.checkbox,
                  { borderColor: colors.primaryMuted },
                  task.done && {
                    backgroundColor: colors.success,
                    borderColor: 'transparent',
                  },
                ]}
              >
                {task.done ? (
                  <Check size={12} color={colors.textOnPrimary} strokeWidth={3} />
                ) : null}
              </View>
              <Text
                style={[
                  styles.taskTitle,
                  { color: colors.text },
                  task.done && {
                    textDecorationLine: 'line-through',
                    color: colors.textSecondary,
                  },
                ]}
                numberOfLines={1}
              >
                {task.title}
              </Text>
            </Pressable>
          ))}
        </View>
      ) : (
        <View style={styles.body}>
          <Text style={[styles.message, { color: colors.textSecondary }]}>
            {emptyMessage === 'Record your first Bobble.' ? (
              <>
                Record your first <Text style={{ color: colors.primary }}>Bobble</Text>.
              </>
            ) : (
              emptyMessage
            )}
          </Text>
          <View style={styles.mascotWrap}>
            <Image source={SLEEP_MASCOT} style={styles.mascot} contentFit="contain" />
          </View>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    height: '100%',
    width: '49%',
    borderRadius: 20,
    borderWidth: 1,
    padding: 14,
    minHeight: 150,
    gap: 8,
  },
  title: {
    ...Typography.caption,
    fontFamily: Typography.button.fontFamily,
    fontSize: 16,
  },
  list: {
    flex: 1,
    justifyContent: 'center',
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    paddingVertical: 10,
  },
  checkbox: {
    width: 25,
    height: 25,
    borderRadius: 999,
    borderWidth: 1.5,
    alignItems: 'center',
    justifyContent: 'center',
  },
  taskTitle: {
    ...Typography.body,
    fontFamily: Typography.button.fontFamily,
    fontSize: 14,
    flex: 1,
  },
  body: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    gap: 10,
  },
  mascotWrap: {
    width: '100%',
    height: '50%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  mascot: {
    height: 100,
    width: 150,
    marginLeft: 15,
  },
  message: {
    ...Typography.body,
    fontFamily: Typography.button.fontFamily,
    fontSize: 14,
    lineHeight: 20,
  },
});
