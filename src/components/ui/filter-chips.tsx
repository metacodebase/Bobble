import { Pressable, ScrollView, StyleSheet, Text } from 'react-native';

import { useBobbleColors } from '@/src/hooks/use-bobble-colors';
import { Typography } from '@/src/theme/fonts';

export type FilterChipsProps<T extends string> = {
  options: readonly T[];
  active: T;
  onChange: (value: T) => void;
  icons?: Partial<Record<T, React.ElementType>>;
};

export function FilterChips<T extends string>({ options, active, onChange, icons }: FilterChipsProps<T>) {
  const colors = useBobbleColors();

  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={styles.row}
    >
      {options.map((option) => {
        const selected = option === active;
        const Icon = icons?.[option];
        return (
          <Pressable
            key={option}
            onPress={() => onChange(option)}
            style={[
              styles.chip,
              { backgroundColor: selected ? colors.primaryLight : colors.surface },
              !selected && { shadowColor: colors.primary, shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.05, shadowRadius: 4, elevation: 1 },
            ]}
          >
            {Icon && (
              <Icon 
                size={16} 
                color={selected ? colors.textOnPrimary : colors.primaryLight} 
                style={styles.icon}
              />
            )}
            <Text
              style={[
                styles.label,
                { color: selected ? colors.textOnPrimary : '#1E1145' },
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
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  icon: {
    marginRight: -2,
  },
  label: {
    ...Typography.caption,
    fontFamily: Typography.button.fontFamily,
  },
});
