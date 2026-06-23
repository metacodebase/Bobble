import { Check, LucideIcon, Monitor, Moon, Sun } from 'lucide-react-native';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { useBobbleColors } from '@/src/hooks/use-bobble-colors';
import { Typography } from '@/src/theme/fonts';

export type ThemePreference = 'system' | 'light' | 'dark';

const ICONS: Record<ThemePreference, LucideIcon> = {
  system: Monitor,
  light: Sun,
  dark: Moon,
};

type ThemeOptionRowProps = {
  value: ThemePreference;
  label: string;
  description: string;
  selected: boolean;
  onSelect: (value: ThemePreference) => void;
  isLast?: boolean;
};

export function ThemeOptionRow({
  value,
  label,
  description,
  selected,
  onSelect,
  isLast,
}: ThemeOptionRowProps) {
  const colors = useBobbleColors();
  const Icon = ICONS[value];

  return (
    <Pressable
      onPress={() => onSelect(value)}
      style={({ pressed }) => [
        styles.row,
        !isLast && { borderBottomWidth: StyleSheet.hairlineWidth, borderBottomColor: colors.border },
        pressed && styles.pressed,
      ]}
    >
      <View style={[styles.iconWrap, { backgroundColor: colors.background }]}>
        <Icon size={20} color={selected ? colors.primary : colors.textSecondary} strokeWidth={2} />
      </View>
      <View style={styles.textBlock}>
        <Text style={[styles.label, { color: colors.text }]}>{label}</Text>
        <Text style={[styles.description, { color: colors.textSecondary }]}>{description}</Text>
      </View>
      <View
        style={[
          styles.radio,
          { borderColor: selected ? colors.primary : colors.border },
          selected && { backgroundColor: colors.primary },
        ]}
      >
        {selected ? <Check size={14} color={colors.textOnPrimary} strokeWidth={3} /> : null}
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
    paddingHorizontal: 16,
    paddingVertical: 14,
  },
  pressed: {
    opacity: 0.85,
  },
  iconWrap: {
    width: 40,
    height: 40,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  textBlock: {
    flex: 1,
    gap: 2,
  },
  label: {
    ...Typography.body,
    fontFamily: Typography.button.fontFamily,
  },
  description: {
    ...Typography.caption,
  },
  radio: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 2,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
