import { Check, Search } from 'lucide-react-native';
import { ReactNode, useMemo, useState } from 'react';
import {
  FlatList,
  Modal,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { useBobbleColors } from '@/src/hooks/use-bobble-colors';
import { Typography } from '@/src/theme/fonts';

export type PickerOption = {
  id: string;
  label: string;
  /** Optional secondary line shown under the label */
  sublabel?: string;
  /** Optional leading element (e.g. a flag) */
  leading?: ReactNode;
  /** Extra text used for filtering that isn't shown */
  keywords?: string;
};

type PickerModalProps = {
  visible: boolean;
  title: string;
  options: PickerOption[];
  selectedId?: string;
  searchable?: boolean;
  searchPlaceholder?: string;
  onSelect: (id: string) => void;
  onClose: () => void;
};

export function PickerModal({
  visible,
  title,
  options,
  selectedId,
  searchable = true,
  searchPlaceholder = 'Search',
  onSelect,
  onClose,
}: PickerModalProps) {
  const colors = useBobbleColors();
  const insets = useSafeAreaInsets();
  const [query, setQuery] = useState('');

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return options;
    return options.filter((option) =>
      `${option.label} ${option.sublabel ?? ''} ${option.keywords ?? ''}`
        .toLowerCase()
        .includes(q),
    );
  }, [options, query]);

  const handleClose = () => {
    setQuery('');
    onClose();
  };

  const handleSelect = (id: string) => {
    setQuery('');
    onSelect(id);
  };

  return (
    <Modal visible={visible} transparent animationType="slide" onRequestClose={handleClose}>
      <View style={styles.root}>
        <Pressable
          style={styles.backdrop}
          onPress={handleClose}
          accessibilityRole="button"
          accessibilityLabel="Close"
        />

        <View
          style={[
            styles.sheet,
            { backgroundColor: colors.background, paddingBottom: insets.bottom + 12 },
          ]}
        >
          <View style={[styles.handle, { backgroundColor: colors.border }]} />

          <Text style={[styles.title, { color: colors.text }]}>{title}</Text>

          {searchable ? (
            <View
              style={[
                styles.searchBox,
                { backgroundColor: colors.borderLight, borderColor: colors.border },
              ]}
            >
              <Search size={18} color={colors.textSecondary} strokeWidth={2} />
              <TextInput
                value={query}
                onChangeText={setQuery}
                placeholder={searchPlaceholder}
                placeholderTextColor={colors.textSecondary}
                autoCorrect={false}
                style={[styles.searchInput, { color: colors.text }]}
              />
            </View>
          ) : null}

          <FlatList
            data={filtered}
            keyExtractor={(item) => item.id}
            keyboardShouldPersistTaps="handled"
            style={styles.list}
            contentContainerStyle={styles.listContent}
            showsVerticalScrollIndicator={false}
            ListEmptyComponent={
              <Text style={[styles.empty, { color: colors.textSecondary }]}>No results</Text>
            }
            renderItem={({ item }) => {
              const selected = item.id === selectedId;
              return (
                <Pressable
                  onPress={() => handleSelect(item.id)}
                  style={({ pressed }) => [
                    styles.row,
                    { borderBottomColor: colors.border },
                    pressed && { backgroundColor: colors.borderLight },
                  ]}
                >
                  {item.leading ? <View style={styles.leading}>{item.leading}</View> : null}
                  <View style={styles.rowText}>
                    <Text style={[styles.rowLabel, { color: colors.text }]} numberOfLines={1}>
                      {item.label}
                    </Text>
                    {item.sublabel ? (
                      <Text
                        style={[styles.rowSublabel, { color: colors.textSecondary }]}
                        numberOfLines={1}
                      >
                        {item.sublabel}
                      </Text>
                    ) : null}
                  </View>
                  {selected ? (
                    <Check size={20} color={colors.primary} strokeWidth={2.5} />
                  ) : null}
                </Pressable>
              );
            }}
          />
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  backdrop: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 0, 0, 0.45)',
  },
  sheet: {
    maxHeight: '80%',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    paddingHorizontal: 20,
    paddingTop: 10,
  },
  handle: {
    alignSelf: 'center',
    width: 40,
    height: 4,
    borderRadius: 2,
    marginBottom: 12,
  },
  title: {
    ...Typography.heading,
    fontSize: 22,
    lineHeight: 28,
    marginBottom: 14,
  },
  searchBox: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    borderWidth: 1,
    borderRadius: 16,
    paddingHorizontal: 14,
    marginBottom: 8,
  },
  searchInput: {
    ...Typography.input,
    flex: 1,
    paddingVertical: 12,
  },
  list: {
    flexGrow: 0,
  },
  listContent: {
    paddingBottom: 8,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
    paddingVertical: 14,
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  leading: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  rowText: {
    flex: 1,
    gap: 2,
  },
  rowLabel: {
    ...Typography.body,
  },
  rowSublabel: {
    ...Typography.caption,
  },
  empty: {
    ...Typography.body,
    textAlign: 'center',
    paddingVertical: 32,
  },
});
