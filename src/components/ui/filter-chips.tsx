import { Pressable, ScrollView, StyleSheet, Text } from 'react-native';

import { useBobbleColors } from '@/src/hooks/use-bobble-colors';
import { Typography } from '@/src/theme/fonts';

type FilterChipsProps<T extends string> = {
  options: readonly T[];
  active: T;
  onChange: (value: T) => void;
};

export function FilterChips<T extends string>({ options, active, onChange }: FilterChipsProps<T>) {
  const colors = useBobbleColors();

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
            style={[
              styles.chip,
              { backgroundColor: selected ? colors.primary : colors.borderLight },
            ]}
          >
            <Text
              style={[
                styles.label,
                { color: selected ? colors.textOnPrimary : colors.text },
              ]}
            >
              {option}
            </Text>
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
  },
  label: {
    ...Typography.caption,
    fontFamily: Typography.button.fontFamily,
  },
});
