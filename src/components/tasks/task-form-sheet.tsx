import { Bell, CalendarClock, X } from 'lucide-react-native';
import { useEffect, useState } from 'react';
import {
  KeyboardAvoidingView,
  Modal,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { DatePickerModal } from '@/src/components/create-account/date-picker-modal';
import { PrimaryButton } from '@/src/components/onboarding/primary-button';
import type { TaskPriority } from '@/src/features/tasks/types';
import { useBobbleColors } from '@/src/hooks/use-bobble-colors';
import { Typography } from '@/src/theme/fonts';

const PRIORITIES: TaskPriority[] = ['low', 'medium', 'high'];

export interface TaskFormValues {
  title: string;
  notes?: string;
  priority: TaskPriority;
  dueAt: string | null;
  reminderAt: string | null;
}

type TaskFormSheetProps = {
  visible: boolean;
  mode: 'create' | 'edit';
  initial?: Partial<TaskFormValues>;
  submitting?: boolean;
  onClose: () => void;
  onSubmit: (values: TaskFormValues) => void;
};

type PickerTarget = 'due' | 'reminder' | null;

function toDate(value?: string | null): Date | null {
  if (!value) return null;
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? null : date;
}

function formatDate(date: Date | null): string {
  if (!date) return '';
  return date.toLocaleDateString([], { month: 'short', day: 'numeric', year: 'numeric' });
}

export function TaskFormSheet({
  visible,
  mode,
  initial,
  submitting = false,
  onClose,
  onSubmit,
}: TaskFormSheetProps) {
  const colors = useBobbleColors();
  const insets = useSafeAreaInsets();
  const currentYear = new Date().getFullYear();

  const [title, setTitle] = useState('');
  const [notes, setNotes] = useState('');
  const [priority, setPriority] = useState<TaskPriority>('medium');
  const [dueAt, setDueAt] = useState<Date | null>(null);
  const [reminderAt, setReminderAt] = useState<Date | null>(null);
  const [picker, setPicker] = useState<PickerTarget>(null);

  useEffect(() => {
    if (!visible) return;
    setTitle(initial?.title ?? '');
    setNotes(initial?.notes ?? '');
    setPriority(initial?.priority ?? 'medium');
    setDueAt(toDate(initial?.dueAt));
    setReminderAt(toDate(initial?.reminderAt));
    setPicker(null);
  }, [visible, initial]);

  const handleSubmit = () => {
    const trimmed = title.trim();
    if (!trimmed) return;
    onSubmit({
      title: trimmed,
      notes: notes.trim() ? notes.trim() : undefined,
      priority,
      dueAt: dueAt ? dueAt.toISOString() : null,
      reminderAt: reminderAt ? reminderAt.toISOString() : null,
    });
  };

  const pickerValue = picker === 'due' ? dueAt : picker === 'reminder' ? reminderAt : null;

  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onClose}>
      <KeyboardAvoidingView
        style={styles.root}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <Pressable
          style={styles.backdrop}
          onPress={onClose}
          accessibilityRole="button"
          accessibilityLabel="Close"
        />

        <View
          style={[
            styles.sheet,
            { backgroundColor: colors.background, paddingBottom: insets.bottom + 16 },
          ]}
        >
          <View style={styles.headerRow}>
            <Text style={[styles.title, { color: colors.text }]}>
              {mode === 'edit' ? 'Edit task' : 'New task'}
            </Text>
            <Pressable onPress={onClose} hitSlop={8}>
              <X size={22} color={colors.textSecondary} strokeWidth={2} />
            </Pressable>
          </View>

          <ScrollView
            keyboardShouldPersistTaps="handled"
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.form}
          >
            <TextInput
              value={title}
              onChangeText={setTitle}
              placeholder="What do you need to do?"
              placeholderTextColor={colors.textSecondary}
              autoFocus={mode === 'create'}
              returnKeyType="next"
              style={[
                styles.input,
                {
                  color: colors.text,
                  borderColor: colors.border,
                  backgroundColor: colors.borderLight,
                },
              ]}
            />

            <TextInput
              value={notes}
              onChangeText={setNotes}
              placeholder="Notes (optional)"
              placeholderTextColor={colors.textSecondary}
              multiline
              style={[
                styles.input,
                styles.notesInput,
                {
                  color: colors.text,
                  borderColor: colors.border,
                  backgroundColor: colors.borderLight,
                },
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

            <DateField
              icon={<CalendarClock size={18} color={colors.textSecondary} strokeWidth={2} />}
              label="Due date"
              value={formatDate(dueAt)}
              onPress={() => setPicker('due')}
              onClear={dueAt ? () => setDueAt(null) : undefined}
            />
            <DateField
              icon={<Bell size={18} color={colors.textSecondary} strokeWidth={2} />}
              label="Reminder"
              value={formatDate(reminderAt)}
              onPress={() => setPicker('reminder')}
              onClear={reminderAt ? () => setReminderAt(null) : undefined}
            />
          </ScrollView>

          <PrimaryButton
            label={mode === 'edit' ? 'Save changes' : 'Add task'}
            onPress={handleSubmit}
            loading={submitting}
            disabled={!title.trim()}
            style={{ width: '100%', marginTop: 8 }}
          />
        </View>
      </KeyboardAvoidingView>

      <DatePickerModal
        visible={picker !== null}
        value={pickerValue}
        minYear={currentYear}
        maxYear={currentYear + 5}
        onSelect={(date) => {
          if (picker === 'due') setDueAt(date);
          else if (picker === 'reminder') setReminderAt(date);
        }}
        onClose={() => setPicker(null)}
      />
    </Modal>
  );
}

function DateField({
  icon,
  label,
  value,
  onPress,
  onClear,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
  onPress: () => void;
  onClear?: () => void;
}) {
  const colors = useBobbleColors();
  return (
    <Pressable
      onPress={onPress}
      style={[styles.dateField, { borderColor: colors.border, backgroundColor: colors.borderLight }]}
    >
      {icon}
      <Text style={[styles.dateLabel, { color: colors.text }]}>{label}</Text>
      <Text style={[styles.dateValue, { color: value ? colors.text : colors.textSecondary }]}>
        {value || 'None'}
      </Text>
      {onClear ? (
        <Pressable onPress={onClear} hitSlop={8}>
          <X size={16} color={colors.textSecondary} strokeWidth={2} />
        </Pressable>
      ) : null}
    </Pressable>
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
    maxHeight: '85%',
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  title: {
    ...Typography.heading,
    fontSize: 22,
    lineHeight: 28,
  },
  form: {
    gap: 12,
    paddingBottom: 4,
  },
  input: {
    ...Typography.body,
    borderWidth: 1,
    borderRadius: 14,
    paddingHorizontal: 16,
    paddingVertical: 14,
  },
  notesInput: {
    minHeight: 72,
    textAlignVertical: 'top',
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
  dateField: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    borderWidth: 1,
    borderRadius: 14,
    paddingHorizontal: 16,
    paddingVertical: 14,
  },
  dateLabel: {
    ...Typography.body,
    flex: 1,
  },
  dateValue: {
    ...Typography.caption,
  },
});
