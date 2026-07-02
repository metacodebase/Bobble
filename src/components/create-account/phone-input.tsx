import { ChevronDown } from 'lucide-react-native';
import { useState } from 'react';
import { Pressable, StyleSheet, Text, TextInput, View } from 'react-native';

import { FormField } from '@/src/components/create-account/form-field';
import { PickerModal } from '@/src/components/create-account/picker-modal';
import { COUNTRIES, type Country } from '@/src/data/countries';
import { useBobbleColors } from '@/src/hooks/use-bobble-colors';
import { Typography } from '@/src/theme/fonts';

type PhoneInputProps = {
  value: string;
  onChangeText: (text: string) => void;
  country: Country;
  onChangeCountry: (country: Country) => void;
};

export function PhoneInput({
  value,
  onChangeText,
  country,
  onChangeCountry,
}: PhoneInputProps) {
  const colors = useBobbleColors();
  const [pickerVisible, setPickerVisible] = useState(false);

  return (
    <FormField label="Phone">
      <View
        style={[
          styles.container,
          { borderColor: colors.border, backgroundColor: colors.surface },
        ]}
      >
        <Pressable
          onPress={() => setPickerVisible(true)}
          style={[styles.prefix, { borderRightColor: colors.border }]}
          accessibilityRole="button"
          accessibilityLabel={`Country code ${country.dialCode}`}
        >
          <Text style={styles.flag}>{country.flag}</Text>
          <Text style={[styles.code, { color: colors.text }]}>{country.dialCode}</Text>
          <ChevronDown size={16} color={colors.textSecondary} strokeWidth={2} />
        </Pressable>
        <TextInput
          value={value}
          onChangeText={onChangeText}
          placeholder="987 654 3210"
          placeholderTextColor={colors.textSecondary}
          keyboardType="phone-pad"
          style={[styles.input, { color: colors.text }]}
        />
      </View>

      <PickerModal
        visible={pickerVisible}
        title="Select country"
        searchPlaceholder="Search country or code"
        selectedId={country.code}
        options={COUNTRIES.map((c) => ({
          id: c.code,
          label: c.name,
          sublabel: c.dialCode,
          keywords: c.dialCode,
          leading: <Text style={styles.optionFlag}>{c.flag}</Text>,
        }))}
        onSelect={(id) => {
          const next = COUNTRIES.find((c) => c.code === id);
          if (next) onChangeCountry(next);
          setPickerVisible(false);
        }}
        onClose={() => setPickerVisible(false)}
      />
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
  optionFlag: {
    fontSize: 24,
  },
});
