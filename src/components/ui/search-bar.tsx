import { Search, SlidersHorizontal } from 'lucide-react-native';
import { Pressable, StyleSheet, TextInput, View } from 'react-native';

import { BobbleColors } from '@/src/theme/colors';
import { Typography } from '@/src/theme/fonts';

type SearchBarProps = {
  value: string;
  onChangeText: (text: string) => void;
  placeholder?: string;
  onFilterPress?: () => void;
};

export function SearchBar({
  value,
  onChangeText,
  placeholder = 'Search...',
  onFilterPress,
}: SearchBarProps) {
  return (
    <View style={styles.root}>
      <Search size={18} color={BobbleColors.textSecondary} strokeWidth={2} />
      <TextInput
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        placeholderTextColor={BobbleColors.textSecondary}
        style={styles.input}
      />
      {onFilterPress ? (
        <Pressable onPress={onFilterPress} hitSlop={8}>
          <SlidersHorizontal size={18} color={BobbleColors.textSecondary} strokeWidth={2} />
        </Pressable>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    backgroundColor: BobbleColors.borderLight,
    borderRadius: 14,
    paddingHorizontal: 14,
    paddingVertical: 12,
  },
  input: {
    flex: 1,
    ...Typography.input,
    color: BobbleColors.text,
    padding: 0,
  },
});
