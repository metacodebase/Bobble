import { StyleSheet, Text, TextInput, View } from 'react-native';

import { FormField } from '@/src/components/create-account/form-field';
import { useBobbleColors } from '@/src/hooks/use-bobble-colors';
import { Typography } from '@/src/theme/fonts';

type PhoneInputProps = {
  value: string;
  onChangeText: (text: string) => void;
};

export function PhoneInput({ value, onChangeText }: PhoneInputProps) {
  const colors = useBobbleColors();

  return (
    <FormField label="Phone">
      <View
        style={[
          styles.container,
          { borderColor: colors.border, backgroundColor: colors.surface },
        ]}
      >
        <View style={[styles.prefix, { borderRightColor: colors.border }]}>
          <Text style={styles.flag}>🇺🇸</Text>
          <Text style={[styles.code, { color: colors.text }]}>+1</Text>
        </View>
        <TextInput
          value={value}
          onChangeText={onChangeText}
          placeholder="987 654 3210"
          placeholderTextColor={colors.textSecondary}
          keyboardType="phone-pad"
          style={[styles.input, { color: colors.text }]}
        />
      </View>
    </FormField>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderRadius: 32,
    paddingHorizontal: 20,
    paddingVertical: 4,
  },
  prefix: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingRight: 12,
    borderRightWidth: 1,
    marginRight: 12,
  },
  flag: {
    fontSize: 18,
  },
  code: {
    ...Typography.input,
  },
  input: {
    ...Typography.input,
    flex: 1,
    paddingVertical: 12,
  },
});
