import { Href, router } from 'expo-router';
import { useState } from 'react';
import { FlatList, StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { BOBBLE_FILTER_CHIP_STYLES } from '@/src/components/bobbles/bobble-category-config';
import { BobbleLibraryRow } from '@/src/components/bobbles/bobble-library-row';
import { FilterChips } from '@/src/components/ui/filter-chips';
import { ScreenHeader } from '@/src/components/ui/screen-header';
import { SearchBar } from '@/src/components/ui/search-bar';
import {
  BOBBLE_FILTERS,
  BobbleFilter,
  filterBobbles,
} from '@/src/data/demo-data';
import { useTabBarInsets } from '@/src/hooks/use-tab-bar-insets';

export default function BobblesScreen() {
  const insets = useSafeAreaInsets();
  const { height: tabBarHeight } = useTabBarInsets();
  const [filter, setFilter] = useState<BobbleFilter>('All');
  const [query, setQuery] = useState('');
  const bobbles = filterBobbles(filter, query);

  return (
    <View style={[styles.root, { paddingTop: insets.top + 12 }]}>
      <View style={styles.header}>
        <ScreenHeader title="Bobbles" compact />
        <SearchBar
          value={query}
          onChangeText={setQuery}
          placeholder="Search Bobbles..."
        />
        <FilterChips
          options={BOBBLE_FILTERS}
          active={filter}
          onChange={setFilter}
          chipStyles={BOBBLE_FILTER_CHIP_STYLES}
          compact
        />
      </View>

      <FlatList
        data={bobbles}
        keyExtractor={(item) => item.id}
        contentContainerStyle={[styles.list, { paddingBottom: tabBarHeight + 24 }]}
        showsVerticalScrollIndicator={false}
        ItemSeparatorComponent={() => <View style={styles.separator} />}
        renderItem={({ item }) => (
          <BobbleLibraryRow
            title={item.title}
            timestamp={item.timestamp}
            category={item.category}
            onPress={() => router.push({ pathname: '/bobble/[id]', params: { id: item.id } } as Href)}
          />
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    paddingHorizontal: 16,
  },
  header: {
    gap: 8,
    marginBottom: 8,
    width: '100%',
    alignSelf: 'center',
  },
  list: {
    paddingTop: 4,
    width: '100%',
    alignSelf: 'center',
  },
  separator: {
    height: 12,
  },
});
