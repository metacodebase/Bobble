import { Ionicons } from '@expo/vector-icons';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { FormField } from '@/src/components/create-account/form-field';
import { BobbleColors } from '@/src/theme/colors';
import { Typography } from '@/src/theme/fonts';

type SelectFieldProps = {
  label: string;
  value: string;
  icon: 'calendar' | 'chevron';
  onPress?: () => void;
};

export function SelectField({ label, value, icon, onPress }: SelectFieldProps) {
  return (
    <FormField label={label}>
      <Pressable
        onPress={onPress}
        style={({ pressed }) => [styles.field, pressed && styles.fieldPressed]}
      >
        <Text style={styles.value}>{value}</Text>
        <Ionicons
          name={icon === 'calendar' ? 'calendar-outline' : 'chevron-down'}
          size={20}
          color={BobbleColors.textSecondary}
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
    borderColor: BobbleColors.border,
    borderRadius: 16,
    paddingHorizontal: 16,
    paddingVertical: 16,
    backgroundColor: BobbleColors.background,
  },
  fieldPressed: {
    backgroundColor: BobbleColors.borderLight,
  },
  value: {
    ...Typography.input,
    color: BobbleColors.text,
    flex: 1,
  },
});
