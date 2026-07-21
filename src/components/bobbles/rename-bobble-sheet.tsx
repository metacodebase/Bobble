import { useEffect, useState } from 'react';
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
import { useBobbleColors } from '@/src/hooks/use-bobble-colors';
import { Typography } from '@/src/theme/fonts';

type RenameBobbleSheetProps = {
  visible: boolean;
  initialTitle: string;
  submitting?: boolean;
  onClose: () => void;
  onSubmit: (title: string) => void;
};

export function RenameBobbleSheet({
  visible,
  initialTitle,
  submitting = false,
  onClose,
  onSubmit,
}: RenameBobbleSheetProps) {
  const colors = useBobbleColors();
  const insets = useSafeAreaInsets();
  const [title, setTitle] = useState(initialTitle);

  useEffect(() => {
    if (visible) setTitle(initialTitle);
  }, [initialTitle, visible]);

  const handleSubmit = () => {
    const trimmed = title.trim();
    if (!trimmed || submitting) return;
    onSubmit(trimmed);
  };

  return (
    <Modal visible={visible} transparent animationType="slide" onRequestClose={onClose}>
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
            {
              backgroundColor: colors.background,
              paddingBottom: insets.bottom + 12,
            },
          ]}
        >
          <View style={[styles.card, { backgroundColor: colors.surface }]}>
            <Text style={[styles.title, { color: colors.text }]}>Rename Bobble</Text>
            <Text style={[styles.subtitle, { color: colors.textSecondary }]}>
              Choose a name that helps you find this later.
            </Text>

            <TextInput
              value={title}
              onChangeText={setTitle}
              placeholder="Bobble title"
              placeholderTextColor={colors.textSecondary}
              autoFocus
              maxLength={200}
              returnKeyType="done"
              onSubmitEditing={handleSubmit}
              style={[
                styles.input,
                {
                  color: colors.text,
                  borderColor: colors.border,
                  backgroundColor: colors.borderLight ?? colors.background,
                },
              ]}
            />
          </View>

          <PrimaryButton
            label="Save"
            onPress={handleSubmit}
            loading={submitting}
            disabled={!title.trim()}
            showChevron={false}
            style={styles.saveButton}
          />

          <Pressable
            onPress={onClose}
            disabled={submitting}
            style={({ pressed }) => [
              styles.cancel,
              { backgroundColor: colors.surface },
              pressed && styles.pressed,
            ]}
          >
            <Text style={[styles.cancelLabel, { color: colors.textSecondary }]}>Cancel</Text>
          </Pressable>
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
    paddingHorizontal: 16,
    paddingTop: 12,
    gap: 10,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
  },
  card: {
    borderRadius: 20,
    paddingHorizontal: 18,
    paddingVertical: 16,
    gap: 12,
  },
  title: {
    ...Typography.heading,
    fontSize: 20,
    lineHeight: 26,
    textAlign: 'center',
  },
  subtitle: {
    ...Typography.body,
    fontSize: 14,
    lineHeight: 20,
    textAlign: 'center',
  },
  input: {
    ...Typography.body,
    borderWidth: StyleSheet.hairlineWidth,
    borderRadius: 14,
    paddingHorizontal: 14,
    paddingVertical: 12,
  },
  saveButton: {
    width: '100%',
  },
  cancel: {
    borderRadius: 20,
    minHeight: 52,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 16,
  },
  cancelLabel: {
    ...Typography.button,
    fontSize: 16,
  },
  pressed: {
    opacity: 0.85,
  },
});
