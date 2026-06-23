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
import { useTabBarInsets } from '@/src/hooks/use-tab-bar-insets';
import { BobbleColors } from '@/src/theme/colors';

export default function BobblesScreen() {
  const insets = useSafeAreaInsets();
  const { height: tabBarHeight } = useTabBarInsets();
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
        />
        <FilterChips options={BOBBLE_FILTERS} active={filter} onChange={setFilter} />
      </View>

      <FlatList
        data={bobbles}
        keyExtractor={(item) => item.id}
        contentContainerStyle={[styles.list, { paddingBottom: tabBarHeight + 16 }]}
        showsVerticalScrollIndicator={false}
        renderItem={({ item }) => (
          <BobbleLibraryRow
            title={item.title}
            timestamp={item.timestamp}
            onPress={() => router.push({ pathname: '/bobble/[id]', params: { id: item.id } } as Href)}
          />
        )}
      />

      <FabButton
        bottom={tabBarHeight + 16}
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
