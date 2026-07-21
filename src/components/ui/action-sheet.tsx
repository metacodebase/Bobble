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
  subtitle?: string;
  options: ActionSheetOption[];
  onClose: () => void;
};

export function ActionSheet({ visible, title, subtitle, options, onClose }: ActionSheetProps) {
  const colors = useBobbleColors();
  const insets = useSafeAreaInsets();

  const handlePress = (option: ActionSheetOption) => {
    onClose();
    option.onPress?.();
  };

  return (
    <Modal visible={visible} transparent animationType="slide" onRequestClose={onClose}>
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
          {title || subtitle ? (
            <View style={[styles.header, { backgroundColor: colors.surface }]}>
              {title ? (
                <Text style={[styles.title, { color: colors.text }]} numberOfLines={1}>
                  {title}
                </Text>
              ) : null}
              {subtitle ? (
                <Text style={[styles.subtitle, { color: colors.textSecondary }]} numberOfLines={2}>
                  {subtitle}
                </Text>
              ) : null}
            </View>
          ) : null}

          <View style={[styles.optionsGroup, { backgroundColor: colors.surface }]}>
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
                    <View style={[styles.iconWrap, { backgroundColor: `${colors.primary}18` }]}>
                      <Icon size={20} color={colors.primary} strokeWidth={2} />
                    </View>
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
              { backgroundColor: colors.surface },
              pressed && styles.pressed,
            ]}
          >
            <Text style={[styles.cancelLabel, { color: colors.textSecondary }]}>Cancel</Text>
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
    paddingTop: 12,
    gap: 10,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
  },
  header: {
    borderRadius: 20,
    paddingHorizontal: 18,
    paddingVertical: 16,
    gap: 4,
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
  optionsGroup: {
    borderRadius: 20,
    overflow: 'hidden',
  },
  option: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
    paddingHorizontal: 16,
    paddingVertical: 16,
  },
  iconWrap: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  optionLabel: {
    ...Typography.body,
    fontSize: 16,
    flex: 1,
  },
  destructiveLabel: {
    fontFamily: Typography.button.fontFamily,
  },
  cancel: {
    borderRadius: 20,
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
