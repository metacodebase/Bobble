import { LucideIcon } from 'lucide-react-native';
import { Pressable, ScrollView, StyleSheet, Text } from 'react-native';

import { useBobbleColors } from '@/src/hooks/use-bobble-colors';
import { Typography } from '@/src/theme/fonts';

export type FilterChipsProps<T extends string> = {
  options: readonly T[];
  active: T;
  onChange: (value: T) => void;
  icons?: Record<string, LucideIcon>;
  iconColors?: Record<string, string>;
  chipStyles?: Record<string, { background: string; text: string }>;
  compact?: boolean;
};

export function FilterChips<T extends string>({
  options,
  active,
  onChange,
  icons,
  iconColors,
  chipStyles,
  compact = false,
}: FilterChipsProps<T>) {
  const colors = useBobbleColors();

  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={[styles.row, compact && styles.rowCompact]}
    >
      {options.map((option) => {
        const selected = option === active;
        const Icon = icons?.[option];
        const customStyle = chipStyles?.[option];
        const iconColor = selected
          ? colors.textOnPrimary
          : (iconColors?.[option] ?? customStyle?.text ?? colors.primary);

        return (
          <Pressable
            key={option}
            onPress={() => onChange(option)}
            style={[
              styles.chip,
              compact && styles.chipCompact,
              {
                backgroundColor: selected
                  ? colors.primary
                  : (customStyle?.background ?? colors.surface),
                borderWidth: selected || customStyle ? 0 : 1,
                borderColor: colors.border,
              },
            ]}
          >
            {Icon ? <Icon size={16} color={iconColor} style={styles.icon} /> : null}
            <Text
              style={[
                styles.label,
                compact && styles.labelCompact,

                {
                  color: selected
                    ? colors.textOnPrimary
                    : (customStyle?.text ?? '#1E1145'),
                },
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
  rowCompact: {
    gap: 6,
    paddingVertical: 0,
  },
  chip: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 200,
    flexDirection: 'row',
    alignItems: 'center',
    // gap: 6
  },
  chipCompact: {
    paddingHorizontal: 18,
    paddingVertical: 7,
    borderRadius: 200,
  },
  icon: {
    marginRight: -2,
  },
  label: {
    ...Typography.caption,
    fontFamily: Typography.button.fontFamily,
    marginLeft: 5,
  },
  labelCompact: {
    fontSize: 13,
    fontFamily: Typography.button.fontFamily,
  },
});
