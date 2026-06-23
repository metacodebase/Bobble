import { Ionicons } from '@expo/vector-icons';
import { LucideIcon } from 'lucide-react-native';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { useBobbleColors } from '@/src/hooks/use-bobble-colors';
import { Typography } from '@/src/theme/fonts';

type GoalCardProps = {
  label: string;
  icon: LucideIcon;
  selected: boolean;
  onPress: () => void;
};

export function GoalCard({ label, icon: Icon, selected, onPress }: GoalCardProps) {
  const colors = useBobbleColors();

  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [
        styles.card,
        {
          borderColor: selected ? colors.primary : colors.border,
          backgroundColor: colors.surface,
        },
        pressed && styles.cardPressed,
      ]}
    >
      <View
        style={[
          styles.iconContainer,
          { backgroundColor: `${colors.primary}18` },
          selected && { backgroundColor: colors.primary },
        ]}
      >
        <Icon size={22} color={selected ? colors.textOnPrimary : colors.primary} />
      </View>
      <Text style={[styles.label, { color: colors.text }]}>{label}</Text>
      <View
        style={[
          styles.checkbox,
          { borderColor: colors.border },
          selected && { backgroundColor: colors.primary, borderColor: colors.primary },
        ]}
      >
        {selected ? (
          <Ionicons name="checkmark" size={16} color={colors.textOnPrimary} />
        ) : null}
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
    borderWidth: 1,
    borderRadius: 16,
    paddingHorizontal: 16,
    paddingVertical: 18,
  },
  cardPressed: {
    opacity: 0.9,
  },
  iconContainer: {
    width: 44,
    height: 44,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  label: {
    ...Typography.body,
    flex: 1,
    fontFamily: Typography.input.fontFamily,
  },
  checkbox: {
    width: 24,
    height: 24,
    borderRadius: 6,
    borderWidth: 1.5,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
