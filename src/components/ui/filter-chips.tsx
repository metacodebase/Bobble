import { Pressable, ScrollView, StyleSheet, Text } from 'react-native';

import { BobbleColors } from '@/src/theme/colors';
import { Typography } from '@/src/theme/fonts';

type FilterChipsProps<T extends string> = {
  options: readonly T[];
  active: T;
  onChange: (value: T) => void;
};

export function FilterChips<T extends string>({ options, active, onChange }: FilterChipsProps<T>) {
  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={styles.row}
    >
      {options.map((option) => {
        const selected = option === active;
        return (
          <Pressable
            key={option}
            onPress={() => onChange(option)}
            style={[styles.chip, selected && styles.chipActive]}
          >
            <Text style={[styles.label, selected && styles.labelActive]}>{option}</Text>
          </Pressable>
        );
      })}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  row: {
    gap: 8,
    paddingVertical: 4,
  },
  chip: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: BobbleColors.borderLight,
  },
  chipActive: {
    backgroundColor: BobbleColors.primary,
  },
  label: {
    ...Typography.caption,
    fontFamily: Typography.button.fontFamily,
    color: BobbleColors.textSecondary,
  },
  labelActive: {
    color: BobbleColors.textOnPrimary,
  },
});
