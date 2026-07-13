import { Image } from 'expo-image';
import { Bell, Check, Pencil, Trash2 } from 'lucide-react-native';
import { useState } from 'react';
import { Pressable, StyleSheet, Text, TextInput, View } from 'react-native';

import type { CaptureTaskTemplate } from '@/src/components/capture/generate-capture-tasks';
import { Typography } from '@/src/theme/fonts';

const PROCESSING_TEXT = '#17164B';
const TASKS_MASCOT = require('@/src/assets/images/bobble-tasks-ready.png');

export type ReviewTask = CaptureTaskTemplate & {
  id: string;
};

type ProcessingTasksReviewProps = {
  tasks: ReviewTask[];
  onUpdateTask: (id: string, title: string) => void;
  onDeleteTask: (id: string) => void;
};

type TaskRowProps = {
  task: ReviewTask;
  onUpdate: (id: string, title: string) => void;
  onDelete: (id: string) => void;
};

function TaskRow({ task, onUpdate, onDelete }: TaskRowProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [draft, setDraft] = useState(task.title);
  const isReminder = task.kind === 'reminder';

  const commitEdit = () => {
    const trimmed = draft.trim();
    if (trimmed) {
      onUpdate(task.id, trimmed);
    } else {
      setDraft(task.title);
    }
    setIsEditing(false);
  };

  return (
    <View style={styles.card}>
      <View style={[styles.iconCircle, isReminder ? styles.reminderIconCircle : styles.workoutIconCircle]}>
        {isReminder ? (
          <Bell size={20} color="#7C3AED" strokeWidth={2.2} />
        ) : (
          <Check size={20} color="#7C3AED" strokeWidth={2.8} />
        )}
      </View>

      <View style={styles.cardCopy}>
        {isEditing ? (
          <TextInput
            value={draft}
            onChangeText={setDraft}
            onSubmitEditing={commitEdit}
            autoFocus
            returnKeyType="done"
            style={styles.input}
          />
        ) : (
          <>
            {task.subtitle ? <Text style={styles.cardSubtitle}>{task.subtitle}</Text> : null}
            <Text style={styles.cardTitle} numberOfLines={3}>
              {task.title}
            </Text>
          </>
        )}
      </View>

      <View style={styles.actions}>
        <Pressable
          onPress={
            isEditing
              ? commitEdit
              : () => {
                  setDraft(task.title);
                  setIsEditing(true);
                }
          }
          hitSlop={8}
          style={({ pressed }) => [styles.iconButton, pressed && styles.pressed]}
        >
          {isEditing ? (
            <Check size={18} color="#9F52F2" strokeWidth={2.5} />
          ) : (
            <Pencil size={18} color="#9CA3AF" strokeWidth={2} />
          )}
        </Pressable>
        <Pressable
          onPress={() => onDelete(task.id)}
          hitSlop={8}
          style={({ pressed }) => [styles.iconButton, pressed && styles.pressed]}
        >
          <Trash2 size={18} color="#9CA3AF" strokeWidth={2} />
        </Pressable>
      </View>
    </View>
  );
}

export function ProcessingTasksReview({ tasks, onUpdateTask, onDeleteTask }: ProcessingTasksReviewProps) {
  return (
    <View style={styles.root}>
      <View style={styles.hero}>
        <Text style={styles.title}>Bobble created {tasks.length} tasks</Text>
        <Text style={styles.subtitle}>Review and edit as you like</Text>
      </View>

      <View style={styles.mascotWrap}>
        <Image source={TASKS_MASCOT} style={styles.mascot} contentFit="contain" />
      </View>

      <View style={styles.cards}>
        {tasks.map((task) => (
          <TaskRow key={task.id} task={task} onUpdate={onUpdateTask} onDelete={onDeleteTask} />
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    gap: 12,
    paddingTop: 4,
  },
  hero: {
    alignItems: 'center',
    gap: 4,
  },
  title: {
    ...Typography.heading,
    fontSize: 26,
    lineHeight: 34,
    color: PROCESSING_TEXT,
    textAlign: 'center',
  },
  subtitle: {
    ...Typography.body,
    fontSize: 16,
    lineHeight: 24,
    color: PROCESSING_TEXT,
    textAlign: 'center',
    opacity: 0.82,
  },
  mascotWrap: {
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 4,
  },
  mascot: {
    width: 380,
    height: 262,
    backgroundColor: 'transparent',
  },
  cards: {
    gap: 10,
    marginTop: -80,
  },
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
    backgroundColor: '#FFFFFF',
    borderRadius: 18,
    paddingVertical: 14,
    paddingHorizontal: 16,
    shadowColor: '#9F52F2',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 2,
  },
  iconCircle: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
  },
  workoutIconCircle: {
    backgroundColor: '#EDE9FE',
  },
  reminderIconCircle: {
    backgroundColor: '#EDE9FE',
  },
  cardCopy: {
    flex: 1,
    gap: 2,
  },
  cardSubtitle: {
    ...Typography.caption,
    fontSize: 13,
    lineHeight: 18,
    color: '#6B7280',
  },
  cardTitle: {
    ...Typography.formLabel,
    fontSize: 16,
    lineHeight: 22,
    color: PROCESSING_TEXT,
  },
  input: {
    ...Typography.body,
    color: PROCESSING_TEXT,
    borderWidth: 1,
    borderColor: '#9F52F2',
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  actions: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconButton: {
    padding: 8,
  },
  pressed: {
    opacity: 0.6,
  },
});
