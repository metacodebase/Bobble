import { ChevronRight } from 'lucide-react-native';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { useBobbleColors } from '@/src/hooks/use-bobble-colors';
import { Typography } from '@/src/theme/fonts';

type SettingsLinkRowProps = {
  label: string;
  value?: string;
  onPress?: () => void;
  isLast?: boolean;
};

export function SettingsLinkRow({ label, value, onPress, isLast }: SettingsLinkRowProps) {
  const colors = useBobbleColors();

  return (
    <Pressable
      onPress={onPress}
      disabled={!onPress}
      style={({ pressed }) => [
        styles.row,
        !isLast && { borderBottomWidth: StyleSheet.hairlineWidth, borderBottomColor: colors.border },
        pressed && onPress && styles.pressed,
      ]}
    >
      <Text style={[styles.label, { color: colors.text }]}>{label}</Text>
      <View style={styles.right}>
        {value ? <Text style={[styles.value, { color: colors.textSecondary }]}>{value}</Text> : null}
        {onPress ? <ChevronRight size={18} color={colors.textSecondary} strokeWidth={2} /> : null}
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 16,
    gap: 12,
  },
  pressed: {
    opacity: 0.85,
  },
  label: {
    ...Typography.body,
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
});
