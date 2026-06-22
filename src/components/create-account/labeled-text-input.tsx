import { StyleSheet, TextInput, TextInputProps } from 'react-native';

import { FormField } from '@/src/components/create-account/form-field';
import { BobbleColors } from '@/src/theme/colors';
import { Typography } from '@/src/theme/fonts';

type LabeledTextInputProps = TextInputProps & {
  label: string;
};

export function LabeledTextInput({ label, style, ...props }: LabeledTextInputProps) {
  return (
    <FormField label={label}>
      <TextInput
        placeholderTextColor={BobbleColors.textSecondary}
        style={[styles.input, style]}
        {...props}
      />
    </FormField>
  );
}

const styles = StyleSheet.create({
  input: {
    ...Typography.input,
    color: BobbleColors.text,
    borderWidth: 1,
    borderColor: BobbleColors.border,
    borderRadius: 16,
    paddingHorizontal: 16,
    paddingVertical: 16,
    backgroundColor: BobbleColors.background,
  },
});
