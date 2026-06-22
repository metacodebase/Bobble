import { Ionicons } from '@expo/vector-icons';
import { LucideIcon } from 'lucide-react-native';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { BobbleColors } from '@/src/theme/colors';
import { Typography } from '@/src/theme/fonts';

type GoalCardProps = {
  label: string;
  icon: LucideIcon;
  selected: boolean;
  onPress: () => void;
};

export function GoalCard({ label, icon: Icon, selected, onPress }: GoalCardProps) {
  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [
        styles.card,
        selected && styles.cardSelected,
        pressed && styles.cardPressed,
      ]}
    >
      <View style={[styles.iconContainer, selected && styles.iconContainerSelected]}>
        <Icon size={22} color={selected ? BobbleColors.textOnPrimary : BobbleColors.primary} />
      </View>
      <Text style={styles.label}>{label}</Text>
      <View style={[styles.checkbox, selected && styles.checkboxSelected]}>
        {selected ? (
          <Ionicons name="checkmark" size={16} color={BobbleColors.textOnPrimary} />
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
    borderColor: BobbleColors.border,
    borderRadius: 16,
    paddingHorizontal: 16,
    paddingVertical: 18,
    backgroundColor: BobbleColors.background,
  },
  cardSelected: {
    borderColor: BobbleColors.primary,
    backgroundColor: BobbleColors.background,
  },
  cardPressed: {
    opacity: 0.9,
  },
  iconContainer: {
    width: 44,
    height: 44,
    borderRadius: 12,
    backgroundColor: BobbleColors.primary + '18',
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconContainerSelected: {
    backgroundColor: BobbleColors.primary,
  },
  label: {
    ...Typography.body,
    color: BobbleColors.text,
    flex: 1,
    fontFamily: Typography.input.fontFamily,
  },
  checkbox: {
    width: 24,
    height: 24,
    borderRadius: 6,
    borderWidth: 1.5,
    borderColor: BobbleColors.border,
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkboxSelected: {
    backgroundColor: BobbleColors.primary,
    borderColor: BobbleColors.primary,
  },
});
