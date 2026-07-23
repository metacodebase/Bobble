import { Search, SlidersHorizontal } from 'lucide-react-native';
import { Platform, Pressable, StyleSheet, TextInput, View } from 'react-native';

import { useBobbleColors } from '@/src/hooks/use-bobble-colors';
import { Typography } from '@/src/theme/fonts';

export type SearchBarProps = {
  value: string;
  onChangeText: (text: string) => void;
  placeholder?: string;
  onFilterPress?: () => void;
  editable?: boolean;
};

export function SearchBar({
  value,
  onChangeText,
  placeholder = 'Search...',
  onFilterPress,
  editable,
}: SearchBarProps) {
  const colors = useBobbleColors();

  return (
    <View style={[styles.root, { backgroundColor: 'rgba(255, 255, 255, 0.65)' }]}>
      <Search size={18} color={colors.textSecondary} strokeWidth={2} />
      <TextInput
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        placeholderTextColor={colors.textSecondary}
        editable={editable}
        style={[styles.input, { color: colors.text }]}
      />
      {onFilterPress ? (
        <Pressable onPress={onFilterPress} hitSlop={8} style={styles.filterButton}>
          <SlidersHorizontal size={18} color={colors.textSecondary} strokeWidth={2} />
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
    height: 48,
    borderRadius: 28,
    paddingHorizontal: 16,
  },
  input: {
    flex: 1,
    ...Typography.input,
    fontSize: Platform.OS === 'android' ? 18 : 16,
    lineHeight: Platform.OS === 'android' ? 22 : 20,
    padding: 0,
    margin: 0,
    height: '100%',
    textAlignVertical: 'center',
    ...(Platform.OS === 'android' ? { includeFontPadding: false } : null),
  },
  filterButton: {
    justifyContent: 'center',
    alignItems: 'center',
  },
});
