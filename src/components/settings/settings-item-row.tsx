import { ChevronRight } from 'lucide-react-native';
import { ReactNode } from 'react';
import { Pressable, StyleSheet, Switch, Text, View } from 'react-native';

import { useBobbleColors } from '@/src/hooks/use-bobble-colors';
import { Typography } from '@/src/theme/fonts';

type SettingsItemRowProps = {
  label: string;
  icon: ReactNode;
  isLast?: boolean;
};

type SettingsToggleItemRowProps = SettingsItemRowProps & {
  value: boolean;
  onValueChange: (value: boolean) => void;
};

type SettingsLinkItemRowProps = SettingsItemRowProps & {
  value?: string;
  onPress?: () => void;
};

function RowShell({
  label,
  icon,
  isLast,
  right,
}: SettingsItemRowProps & { right: ReactNode }) {
  const colors = useBobbleColors();

  return (
    <View
      style={[
        styles.row,
        !isLast && { borderBottomWidth: StyleSheet.hairlineWidth, borderBottomColor: colors.border },
      ]}
    >
      <View style={styles.left}>
        <View style={styles.icon}>{icon}</View>
        <Text style={[styles.label, { color: colors.text }]}>{label}</Text>
      </View>
      {right}
    </View>
  );
}

export function SettingsToggleItemRow({
  label,
  icon,
  value,
  onValueChange,
  isLast,
}: SettingsToggleItemRowProps) {
  const colors = useBobbleColors();

  return (
    <RowShell
      label={label}
      icon={icon}
      isLast={isLast}
      right={
        <Switch
          value={value}
          onValueChange={onValueChange}
          trackColor={{ false: colors.border, true: colors.primaryMuted }}
          thumbColor={value ? colors.primary : colors.surface}
        />
      }
    />
  );
}

export function SettingsLinkItemRow({ label, icon, value, onPress, isLast }: SettingsLinkItemRowProps) {
  const colors = useBobbleColors();

  return (
    <Pressable
      onPress={onPress}
      disabled={!onPress}
      style={({ pressed }) => [pressed && onPress && styles.pressed]}
    >
      <RowShell
        label={label}
        icon={icon}
        isLast={isLast}
        right={
          <View style={styles.right}>
            {value ? <Text style={[styles.value, { color: colors.textSecondary }]}>{value}</Text> : null}
            {onPress ? <ChevronRight size={18} color={colors.textSecondary} strokeWidth={2} /> : null}
          </View>
        }
      />
    </Pressable>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 14,
    gap: 12,
  },
  left: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  icon: {
    width: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
  label: {
    ...Typography.body,
    fontFamily: Typography.button.fontFamily,
    flex: 1,
  },
  right: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  value: {
    ...Typography.body,
  },
  pressed: {
    opacity: 0.85,
  },
});
