import { ChevronRight, LucideIcon } from 'lucide-react-native';
import { ActivityIndicator, Platform, Pressable, StyleSheet, Text, View, ViewStyle } from 'react-native';

import { BobbleColors } from '@/src/theme/colors';
import { Typography } from '@/src/theme/fonts';

type PrimaryButtonProps = {
  label: string;
  onPress: () => void;
  style?: ViewStyle;
  disabled?: boolean;
  loading?: boolean;
  icon?: LucideIcon;
  showChevron?: boolean;
};

export function PrimaryButton({
  label,
  onPress,
  style,
  disabled = false,
  loading = false,
  icon: Icon,
  showChevron = true,
}: PrimaryButtonProps) {
  const isDisabled = disabled || loading;

  return (
    <Pressable
      onPress={onPress}
      disabled={isDisabled}
      style={({ pressed }) => [
        styles.button,
        style,
        pressed && styles.pressed,
        isDisabled && styles.disabled,
      ]}
    >
      {loading ? (
        <ActivityIndicator color={BobbleColors.textOnPrimary} />
      ) : (
        <View style={styles.content}>
          {Icon ? (
            <Icon
              size={20}
              color={BobbleColors.textOnPrimary}
              strokeWidth={2.4}
              style={styles.leadingIcon}
            />
          ) : null}
          <Text style={styles.label}>{label}</Text>
          {showChevron ? (
            <ChevronRight
              size={22}
              color={BobbleColors.textOnPrimary}
              strokeWidth={2.5}
              style={styles.chevron}
            />
          ) : null}
        </View>
      )}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    backgroundColor: BobbleColors.primary,
    borderRadius: 32,
    paddingVertical: 14,
    minHeight: 52,
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
  },
  pressed: {
    opacity: 0.9,
    backgroundColor: BobbleColors.primaryDark,
  },
  disabled: {
    opacity: 0.6,
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
    width: '100%',
  },
  leadingIcon: {
    marginTop: 1,
  },
  label: {
    ...Typography.button,
    fontSize: Platform.OS === 'android' ? 18 : 16,
    lineHeight: Platform.OS === 'android' ? 21 : 20,
    color: BobbleColors.textOnPrimary,
  },
  chevron: {
    position: 'absolute',
    right: 28,
  },
});
