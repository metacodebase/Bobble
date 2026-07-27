import { CalendarClock, Clock, X } from 'lucide-react-native';
import { useEffect, useState } from 'react';
import {
  KeyboardAvoidingView,
  Modal,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { DatePickerModal } from '@/src/components/create-account/date-picker-modal';
import { PickerModal } from '@/src/components/create-account/picker-modal';
import { PrimaryButton } from '@/src/components/onboarding/primary-button';
import { useBobbleColors } from '@/src/hooks/use-bobble-colors';
import { Typography } from '@/src/theme/fonts';

export interface TaskFormValues {
  title: string;
  notes?: string;
  dueAt: string | null;
}

type TaskFormSheetProps = {
  visible: boolean;
  mode: 'create' | 'edit';
  initial?: Partial<TaskFormValues>;
  submitting?: boolean;
  onClose: () => void;
  onSubmit: (values: TaskFormValues) => void;
};

function toDate(value?: string | null): Date | null {
  if (!value) return null;
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? null : date;
}

function formatDate(date: Date | null): string {
  if (!date) return '';
  return date.toLocaleDateString([], { month: 'short', day: 'numeric', year: 'numeric' });
}

function formatTime(date: Date | null): string {
  if (!date) return '';
  return date.toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' });
}

const TIME_OPTIONS = Array.from({ length: 24 * 4 }).map((_, i) => {
  const totalMinutes = i * 15;
  const h = Math.floor(totalMinutes / 60);
  const m = totalMinutes % 60;
  const isPM = h >= 12;
  const displayH = h === 0 ? 12 : h > 12 ? h - 12 : h;
  const displayM = m.toString().padStart(2, '0');
  const ampm = isPM ? 'PM' : 'AM';
  return {
    id: `${h}:${m}`,
    label: `${displayH}:${displayM} ${ampm}`,
  };
});

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
  const [dueAt, setDueAt] = useState<Date | null>(null);
  const [pickerOpen, setPickerOpen] = useState(false);
  const [timePickerOpen, setTimePickerOpen] = useState(false);

  useEffect(() => {
    if (!visible) return;
    setTitle(initial?.title ?? '');
    setNotes(initial?.notes ?? '');
    setDueAt(toDate(initial?.dueAt));
    setPickerOpen(false);
    setTimePickerOpen(false);
  }, [visible, initial]);

  const handleSubmit = () => {
    const trimmed = title.trim();
    if (!trimmed) return;
    onSubmit({
      title: trimmed,
      notes: notes.trim() ? notes.trim() : undefined,
      dueAt: dueAt ? dueAt.toISOString() : null,
    });
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      presentationStyle="overFullScreen"
      onRequestClose={onClose}
    >
      <KeyboardAvoidingView
        style={styles.root}
        behavior="padding"
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
            { backgroundColor: colors.surface, paddingBottom: insets.bottom + 16 },
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

            <View style={styles.dateRow}>
              <DateField
                icon={<CalendarClock size={18} color={colors.textSecondary} strokeWidth={2} />}
                label="Due date"
                value={formatDate(dueAt)}
                onPress={() => setPickerOpen(true)}
                onClear={dueAt ? () => setDueAt(null) : undefined}
                style={{ flex: 1 }}
                compact={!!dueAt}
              />
              {dueAt ? (
                <DateField
                  icon={<Clock size={18} color={colors.textSecondary} strokeWidth={2} />}
                  label="Time"
                  value={formatTime(dueAt)}
                  onPress={() => setTimePickerOpen(true)}
                  style={{ flex: 1 }}
                  compact={true}
                />
              ) : null}
            </View>
          </ScrollView>

          <PrimaryButton
            label={mode === 'edit' ? 'Save changes' : 'Add task'}
            onPress={handleSubmit}
            loading={submitting}
            disabled={!title.trim()}
            style={{ width: '100%', marginTop: 8 }}
          />
        </View>

        <DatePickerModal
          visible={pickerOpen}
          embedded
          value={dueAt}
          minYear={currentYear}
          maxYear={currentYear + 5}
          onSelect={setDueAt}
          onClose={() => setPickerOpen(false)}
        />

        {timePickerOpen && dueAt ? (
          <PickerModal
            visible={timePickerOpen}
            embedded
            title="Select time"
            options={TIME_OPTIONS}
            searchable={false}
            selectedId={`${dueAt.getHours()}:${dueAt.getMinutes()}`}
            onSelect={(id) => {
              const [h, m] = id.split(':').map(Number);
              const newDate = new Date(dueAt);
              newDate.setHours(h, m, 0, 0);
              setDueAt(newDate);
              setTimePickerOpen(false);
            }}
            onClose={() => setTimePickerOpen(false)}
          />
        ) : null}
      </KeyboardAvoidingView>
    </Modal>
  );
}

function DateField({
  icon,
  label,
  value,
  onPress,
  onClear,
  style,
  compact = false,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
  onPress: () => void;
  onClear?: () => void;
  style?: any;
  compact?: boolean;
}) {
  const colors = useBobbleColors();
  
  if (compact) {
    return (
      <Pressable
        onPress={onPress}
        style={[
          styles.dateFieldCompact,
          { borderColor: colors.border, backgroundColor: colors.borderLight },
          style,
        ]}
      >
        <View style={styles.dateFieldCompactHeader}>
          {icon}
          <Text style={[styles.dateLabelCompact, { color: colors.textSecondary }]} numberOfLines={1}>
            {label}
          </Text>
        </View>
        <View style={styles.dateFieldCompactBody}>
          <Text style={[styles.dateValueCompact, { color: value ? colors.text : colors.textSecondary }]} numberOfLines={1}>
            {value || 'None'}
          </Text>
          {onClear ? (
            <Pressable onPress={onClear} hitSlop={8} style={{ marginLeft: 4 }}>
              <X size={16} color={colors.textSecondary} strokeWidth={2} />
            </Pressable>
          ) : null}
        </View>
      </Pressable>
    );
  }

  return (
    <Pressable
      onPress={onPress}
      style={[styles.dateField, { borderColor: colors.border, backgroundColor: colors.borderLight }, style]}
    >
      {icon}
      <Text style={[styles.dateLabel, { color: colors.text }]} numberOfLines={1}>{label}</Text>
      <Text style={[styles.dateValue, { color: value ? colors.text : colors.textSecondary }]} numberOfLines={1}>
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
    lineHeight: 20,
  },
  notesInput: {
    minHeight: 72,
    textAlignVertical: 'top',
  },
  dateRow: {
    flexDirection: 'row',
    gap: 12,
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
  dateFieldCompact: {
    borderWidth: 1,
    borderRadius: 14,
    paddingHorizontal: 14,
    paddingVertical: 12,
    gap: 6,
  },
  dateFieldCompactHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  dateLabelCompact: {
    ...Typography.caption,
    fontSize: 14,
    flex: 1,
  },
  dateFieldCompactBody: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  dateValueCompact: {
    ...Typography.body,
    fontSize: 15,
    flex: 1,
  },
});
