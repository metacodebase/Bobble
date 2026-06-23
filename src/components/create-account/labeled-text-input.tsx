import { StyleSheet, TextInput, TextInputProps } from 'react-native';

import { FormField } from '@/src/components/create-account/form-field';
import { useBobbleColors } from '@/src/hooks/use-bobble-colors';
import { Typography } from '@/src/theme/fonts';

type LabeledTextInputProps = TextInputProps & {
  label: string;
};

export function LabeledTextInput({ label, style, ...props }: LabeledTextInputProps) {
  const colors = useBobbleColors();

  return (
    <FormField label={label}>
      <TextInput
        placeholderTextColor={colors.textSecondary}
        style={[
          styles.input,
          {
            color: colors.text,
            borderColor: colors.border,
            backgroundColor: colors.surface,
          },
          style,
        ]}
        {...props}
      />
    </FormField>
  );
}

const styles = StyleSheet.create({
  input: {
    ...Typography.input,
    borderWidth: 1,
    borderRadius: 16,
    paddingHorizontal: 16,
    paddingVertical: 16,
  },
});
