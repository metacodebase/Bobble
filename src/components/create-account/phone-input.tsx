import { StyleSheet, Text, TextInput, View } from 'react-native';

import { FormField } from '@/src/components/create-account/form-field';
import { BobbleColors } from '@/src/theme/colors';
import { Typography } from '@/src/theme/fonts';

type PhoneInputProps = {
  value: string;
  onChangeText: (text: string) => void;
};

export function PhoneInput({ value, onChangeText }: PhoneInputProps) {
  return (
    <FormField label="Phone">
      <View style={styles.container}>
        <View style={styles.prefix}>
          <Text style={styles.flag}>🇺🇸</Text>
          <Text style={styles.code}>+1</Text>
        </View>
        <TextInput
          value={value}
          onChangeText={onChangeText}
          placeholder="987 654 3210"
          placeholderTextColor={BobbleColors.textSecondary}
          keyboardType="phone-pad"
          style={styles.input}
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
    borderColor: BobbleColors.border,
    borderRadius: 16,
    paddingHorizontal: 16,
    paddingVertical: 4,
    backgroundColor: BobbleColors.background,
  },
  prefix: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingRight: 12,
    borderRightWidth: 1,
    borderRightColor: BobbleColors.border,
    marginRight: 12,
  },
  flag: {
    fontSize: 18,
  },
  code: {
    ...Typography.input,
    color: BobbleColors.text,
  },
  input: {
    ...Typography.input,
    flex: 1,
    color: BobbleColors.text,
    paddingVertical: 12,
  },
});
