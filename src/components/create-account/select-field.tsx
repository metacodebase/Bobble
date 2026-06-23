import { Ionicons } from '@expo/vector-icons';
import { Pressable, StyleSheet, Text } from 'react-native';

import { FormField } from '@/src/components/create-account/form-field';
import { useBobbleColors } from '@/src/hooks/use-bobble-colors';
import { Typography } from '@/src/theme/fonts';

type SelectFieldProps = {
  label: string;
  value: string;
  icon: 'calendar' | 'chevron';
  onPress?: () => void;
};

export function SelectField({ label, value, icon, onPress }: SelectFieldProps) {
  const colors = useBobbleColors();

  return (
    <FormField label={label}>
      <Pressable
        onPress={onPress}
        style={({ pressed }) => [
          styles.field,
          {
            borderColor: colors.border,
            backgroundColor: pressed ? colors.borderLight : colors.surface,
          },
        ]}
      >
        <Text style={[styles.value, { color: colors.text }]}>{value}</Text>
        <Ionicons
          name={icon === 'calendar' ? 'calendar-outline' : 'chevron-down'}
          size={20}
          color={colors.textSecondary}
        />
      </Pressable>
    </FormField>
  );
}

const styles = StyleSheet.create({
  field: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderWidth: 1,
    borderRadius: 16,
    paddingHorizontal: 16,
    paddingVertical: 16,
  },
  value: {
    ...Typography.input,
    flex: 1,
  },
});
