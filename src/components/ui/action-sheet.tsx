import { LucideIcon } from 'lucide-react-native';
import { Modal, Pressable, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { useBobbleColors } from '@/src/hooks/use-bobble-colors';
import { Typography } from '@/src/theme/fonts';

export type ActionSheetOption = {
  id: string;
  label: string;
  icon?: LucideIcon;
  destructive?: boolean;
  onPress?: () => void;
};

type ActionSheetProps = {
  visible: boolean;
  title?: string;
  options: ActionSheetOption[];
  onClose: () => void;
};

export function ActionSheet({ visible, title, options, onClose }: ActionSheetProps) {
  const colors = useBobbleColors();
  const insets = useSafeAreaInsets();

  const handlePress = (option: ActionSheetOption) => {
    onClose();
    option.onPress?.();
  };

  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onClose}>
      <View style={styles.root}>
        <Pressable style={styles.backdrop} onPress={onClose} accessibilityRole="button" accessibilityLabel="Close menu" />

        <View
          style={[
            styles.sheet,
            {
              backgroundColor: colors.background,
              paddingBottom: insets.bottom + 12,
            },
          ]}
        >
          {title ? (
            <Text style={[styles.title, { color: colors.textSecondary }]} numberOfLines={1}>
              {title}
            </Text>
          ) : null}

          <View style={[styles.optionsGroup, { backgroundColor: colors.borderLight }]}>
            {options.map((option, index) => {
              const Icon = option.icon;
              const isLast = index === options.length - 1;

              return (
                <Pressable
                  key={option.id}
                  onPress={() => handlePress(option)}
                  style={({ pressed }) => [
                    styles.option,
                    !isLast && {
                      borderBottomWidth: StyleSheet.hairlineWidth,
                      borderBottomColor: colors.border,
                    },
                    pressed && styles.pressed,
                  ]}
                >
                  {Icon ? (
                    <Icon
                      size={20}
                      color={option.destructive ? colors.error : colors.textSecondary}
                      strokeWidth={2}
                    />
                  ) : null}
                  <Text
                    style={[
                      styles.optionLabel,
                      { color: option.destructive ? colors.error : colors.text },
                      option.destructive && styles.destructiveLabel,
                    ]}
                  >
                    {option.label}
                  </Text>
                </Pressable>
              );
            })}
          </View>

          <Pressable
            onPress={onClose}
            style={({ pressed }) => [
              styles.cancel,
              { backgroundColor: colors.borderLight },
              pressed && styles.pressed,
            ]}
          >
            <Text style={[styles.cancelLabel, { color: colors.text }]}>Cancel</Text>
          </Pressable>
        </View>
      </View>
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
    paddingTop: 8,
    gap: 8,
  },
  title: {
    ...Typography.caption,
    textAlign: 'center',
    paddingVertical: 8,
    paddingHorizontal: 12,
  },
  optionsGroup: {
    borderRadius: 14,
    overflow: 'hidden',
  },
  option: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingHorizontal: 16,
    paddingVertical: 16,
  },
  optionLabel: {
    ...Typography.body,
  },
  destructiveLabel: {
    fontFamily: Typography.button.fontFamily,
  },
  cancel: {
    borderRadius: 14,
    alignItems: 'center',
    paddingVertical: 16,
  },
  cancelLabel: {
    ...Typography.body,
    fontFamily: Typography.button.fontFamily,
  },
  pressed: {
    opacity: 0.85,
  },
});
