import { Href, router } from 'expo-router';
import { useState } from 'react';
import { FlatList, StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { BobbleLibraryRow } from '@/src/components/bobbles/bobble-library-row';
import { FabButton } from '@/src/components/ui/fab-button';
import { FilterChips } from '@/src/components/ui/filter-chips';
import { ScreenHeader } from '@/src/components/ui/screen-header';
import { SearchBar } from '@/src/components/ui/search-bar';
import {
  BobbleFilter,
  BOBBLE_FILTERS,
  filterBobbles,
} from '@/src/data/demo-data';
import { BobbleColors } from '@/src/theme/colors';
import { toast } from '@/src/utils/toast';

export default function BobblesScreen() {
  const insets = useSafeAreaInsets();
  const [filter, setFilter] = useState<BobbleFilter>('All');
  const [query, setQuery] = useState('');
  const bobbles = filterBobbles(filter, query);

  return (
    <View style={[styles.root, { paddingTop: insets.top + 12 }]}>
      <View style={styles.header}>
        <ScreenHeader title="Bobbles" />
        <SearchBar
          value={query}
          onChangeText={setQuery}
          placeholder="Search bobbles..."
          onFilterPress={() => toast.info('Advanced filters coming soon')}
        />
        <FilterChips options={BOBBLE_FILTERS} active={filter} onChange={setFilter} />
      </View>

      <FlatList
        data={bobbles}
        keyExtractor={(item) => item.id}
        contentContainerStyle={[styles.list, { paddingBottom: insets.bottom + 100 }]}
        showsVerticalScrollIndicator={false}
        renderItem={({ item }) => (
          <BobbleLibraryRow
            title={item.title}
            timestamp={item.timestamp}
            onPress={() => router.push({ pathname: '/bobble/[id]', params: { id: item.id } } as Href)}
            onMenuPress={() => toast.info('Bobble options coming soon')}
          />
        )}
      />

      <FabButton
        bottom={insets.bottom + 88}
        onPress={() => router.push('/capture/record' as Href)}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: BobbleColors.background,
    paddingHorizontal: 24,
  },
  header: {
    gap: 12,
    marginBottom: 8,
  },
  list: {
    paddingTop: 4,
  },
});
