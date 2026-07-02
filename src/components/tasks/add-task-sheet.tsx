import { useState } from 'react';
import {
  KeyboardAvoidingView,
  Modal,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { PrimaryButton } from '@/src/components/onboarding/primary-button';
import type { TaskPriority } from '@/src/features/tasks/types';
import { useBobbleColors } from '@/src/hooks/use-bobble-colors';
import { FontFamily, Typography } from '@/src/theme/fonts';

const PRIORITIES: TaskPriority[] = ['low', 'medium', 'high'];

type AddTaskSheetProps = {
  visible: boolean;
  submitting?: boolean;
  onClose: () => void;
  onSubmit: (input: { title: string; priority: TaskPriority }) => void;
};

export function AddTaskSheet({ visible, submitting = false, onClose, onSubmit }: AddTaskSheetProps) {
  const colors = useBobbleColors();
  const insets = useSafeAreaInsets();
  const [title, setTitle] = useState('');
  const [priority, setPriority] = useState<TaskPriority>('medium');

  const reset = () => {
    setTitle('');
    setPriority('medium');
  };

  const handleClose = () => {
    reset();
    onClose();
  };

  const handleSubmit = () => {
    const trimmed = title.trim();
    if (!trimmed) return;
    onSubmit({ title: trimmed, priority });
    reset();
  };

  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={handleClose}>
      <KeyboardAvoidingView
        style={styles.root}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <Pressable
          style={styles.backdrop}
          onPress={handleClose}
          accessibilityRole="button"
          accessibilityLabel="Close"
        />

        <View
          style={[
            styles.sheet,
            { backgroundColor: colors.background, paddingBottom: insets.bottom + 16 },
          ]}
        >
          <Text style={[styles.title, { color: colors.text }]}>New task</Text>

          <TextInput
            value={title}
            onChangeText={setTitle}
            placeholder="What do you need to do?"
            placeholderTextColor={colors.textSecondary}
            autoFocus
            returnKeyType="done"
            onSubmitEditing={handleSubmit}
            style={[
              styles.input,
              { color: colors.text, borderColor: colors.border, backgroundColor: colors.borderLight },
            ]}
          />

          <Text style={[styles.label, { color: colors.textSecondary }]}>Priority</Text>
          <View style={styles.priorityRow}>
            {PRIORITIES.map((option) => {
              const active = option === priority;
              return (
                <Pressable
                  key={option}
                  onPress={() => setPriority(option)}
                  style={[
                    styles.priorityChip,
                    { borderColor: colors.border },
                    active && { backgroundColor: colors.primary, borderColor: colors.primary },
                  ]}
                >
                  <Text
                    style={[
                      styles.priorityText,
                      { color: active ? colors.textOnPrimary : colors.textSecondary },
                    ]}
                  >
                    {option}
                  </Text>
                </Pressable>
              );
            })}
          </View>

          <PrimaryButton
            label="Add task"
            onPress={handleSubmit}
            loading={submitting}
            disabled={!title.trim()}
            style={{ width: '100%', marginTop: 8 }}
          />
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  backdrop: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 0, 0, 0.45)',
  },
  sheet: {
    paddingHorizontal: 24,
    paddingTop: 20,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    gap: 12,
  },
  title: {
    fontFamily: FontFamily.extraBold,
    fontSize: 20,
    lineHeight: 26,
  },
  input: {
    ...Typography.body,
    borderWidth: 1,
    borderRadius: 14,
    paddingHorizontal: 16,
    paddingVertical: 14,
  },
  label: {
    ...Typography.formLabel,
    marginTop: 4,
  },
  priorityRow: {
    flexDirection: 'row',
    gap: 10,
  },
  priorityChip: {
    flex: 1,
    borderWidth: 1,
    borderRadius: 20,
    paddingVertical: 10,
    alignItems: 'center',
  },
  priorityText: {
    ...Typography.caption,
    textTransform: 'capitalize',
  },
});
