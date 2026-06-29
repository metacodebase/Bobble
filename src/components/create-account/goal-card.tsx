import { Pressable, StyleSheet, Text, View } from 'react-native';

import { CheckIcon, GoalIcon, GoalIconId } from '@/src/components/onboarding/ui-icons';
import { useBobbleColors } from '@/src/hooks/use-bobble-colors';
import { Typography } from '@/src/theme/fonts';

type GoalCardProps = {
  label: string;
  iconId: GoalIconId;
  selected: boolean;
  onPress: () => void;
};

export function GoalCard({ label, iconId, selected, onPress }: GoalCardProps) {
  const colors = useBobbleColors();

  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [
        styles.card,
        {
          borderColor: selected ? colors.primary : colors.border,
          backgroundColor: pressed ? colors.borderLight : colors.surface,
        },
        pressed && styles.cardPressed,
      ]}
    >
      <View style={styles.icon}>
        <GoalIcon
          id={iconId}
          size={22}
          color={selected ? colors.primary : colors.textSecondary}
        />
      </View>
      <Text style={[styles.label, { color: colors.text }]}>{label}</Text>
      <View
        style={[
          styles.checkbox,
          { borderColor: colors.border },
          selected && { backgroundColor: colors.success, borderColor: colors.success },
        ]}
      >
        {selected ? <CheckIcon size={16} strokeWidth={4} color={colors.textOnPrimary} /> : null}
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderRadius: 32,
    paddingHorizontal: 20,
    paddingVertical: 16,
  },
  cardPressed: {
    opacity: 0.9,
  },
  icon: {
    position: 'absolute',
    left: 24,
  },
  label: {
    ...Typography.socialButton,
    flex: 1,
    textAlign: 'center',
  },
  checkbox: {
    width: 26,
    height: 26,
    borderRadius: 13,
    borderWidth: 1.5,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
