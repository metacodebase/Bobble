import { Check, Pencil, Trash2 } from 'lucide-react-native';
import { useState } from 'react';
import { Pressable, StyleSheet, Text, TextInput, View } from 'react-native';

import { useBobbleColors } from '@/src/hooks/use-bobble-colors';
import { Typography } from '@/src/theme/fonts';

export type GeneratedTask = {
  id: string;
  title: string;
};

type GeneratedTaskRowProps = {
  task: GeneratedTask;
  onUpdate: (id: string, title: string) => void;
  onDelete: (id: string) => void;
};

export function GeneratedTaskRow({ task, onUpdate, onDelete }: GeneratedTaskRowProps) {
  const colors = useBobbleColors();
  const [isEditing, setIsEditing] = useState(false);
  const [draft, setDraft] = useState(task.title);

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
    <View style={[styles.row, { backgroundColor: colors.borderLight }]}>
      {isEditing ? (
        <TextInput
          value={draft}
          onChangeText={setDraft}
          onSubmitEditing={commitEdit}
          autoFocus
          returnKeyType="done"
          style={[
            styles.input,
            { color: colors.text, borderColor: colors.primary, backgroundColor: colors.background },
          ]}
        />
      ) : (
        <Text style={[styles.title, { color: colors.text }]} numberOfLines={3}>
          {task.title}
        </Text>
      )}

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
            <Check size={18} color={colors.primary} strokeWidth={2.5} />
          ) : (
            <Pencil size={18} color={colors.textSecondary} strokeWidth={2} />
          )}
        </Pressable>
        <Pressable
          onPress={() => onDelete(task.id)}
          hitSlop={8}
          style={({ pressed }) => [styles.iconButton, pressed && styles.pressed]}
        >
          <Trash2 size={18} color={colors.textSecondary} strokeWidth={2} />
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 16,
    paddingVertical: 12,
    paddingLeft: 16,
    paddingRight: 8,
    gap: 8,
  },
  title: {
    ...Typography.body,
    flex: 1,
  },
  input: {
    ...Typography.body,
    flex: 1,
    borderWidth: 1,
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
