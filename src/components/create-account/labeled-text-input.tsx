import { Ionicons } from '@expo/vector-icons';
import { useState } from 'react';
import { Pressable, StyleSheet, TextInput, TextInputProps, View } from 'react-native';

import { FormField } from '@/src/components/create-account/form-field';
import { useBobbleColors } from '@/src/hooks/use-bobble-colors';
import { Typography } from '@/src/theme/fonts';

type LabeledTextInputProps = TextInputProps & {
  label: string;
};

export function LabeledTextInput({ label, style, ...props }: LabeledTextInputProps) {
  const colors = useBobbleColors();
  const isPasswordField = props.secureTextEntry === true;
  const [isPasswordHidden, setIsPasswordHidden] = useState(isPasswordField);
  const secureTextEntry = isPasswordField ? isPasswordHidden : props.secureTextEntry;

  return (
    <FormField label={label}>
      <View style={styles.inputWrap}>
        <TextInput
          placeholderTextColor={colors.textSecondary}
          style={[
            styles.input,
            isPasswordField ? styles.inputWithToggle : null,
            {
              color: colors.text,
              borderColor: colors.border,
              backgroundColor: colors.surface,
            },
            style,
          ]}
          {...props}
          secureTextEntry={secureTextEntry}
        />
        {isPasswordField ? (
          <Pressable
            accessibilityRole="button"
            accessibilityLabel={isPasswordHidden ? 'Show password' : 'Hide password'}
            hitSlop={10}
            onPress={() => setIsPasswordHidden((current) => !current)}
            style={styles.eyeButton}
          >
            <Ionicons
              name={isPasswordHidden ? 'eye-outline' : 'eye-off-outline'}
              size={20}
              color={colors.textSecondary}
            />
          </Pressable>
        ) : null}
      </View>
    </FormField>
  );
}

const styles = StyleSheet.create({
  inputWrap: {
    position: 'relative',
    justifyContent: 'center',
  },
  input: {
    ...Typography.input,
    height: 55,
    paddingHorizontal: 20,
    borderWidth: 1,
    borderRadius: 32,
    lineHeight: 24,
    letterSpacing: 0,
  },
  inputWithToggle: {
    paddingRight: 52,
  },
  eyeButton: {
    position: 'absolute',
    right: 16,
    height: 40,
    width: 30,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
