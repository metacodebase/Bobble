import { Href, router } from 'expo-router';
import { useState } from 'react';
import { FlatList, StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { BobbleLibraryRow } from '@/src/components/bobbles/bobble-library-row';
import { FAB_SIZE, FabButton } from '@/src/components/ui/fab-button';
import { FilterChips } from '@/src/components/ui/filter-chips';
import { ScreenHeader } from '@/src/components/ui/screen-header';
import { SearchBar } from '@/src/components/ui/search-bar';
import {
  BobbleFilter,
  BOBBLE_FILTERS,
  filterBobbles,
} from '@/src/data/demo-data';
import { useBobbleColors } from '@/src/hooks/use-bobble-colors';
import { useTabBarInsets } from '@/src/hooks/use-tab-bar-insets';

export default function BobblesScreen() {
  const insets = useSafeAreaInsets();
  const colors = useBobbleColors();
  const { height: tabBarHeight } = useTabBarInsets();
  const fabBottom = tabBarHeight + 16;
  const [filter, setFilter] = useState<BobbleFilter>('All');
  const [query, setQuery] = useState('');
  const bobbles = filterBobbles(filter, query);

  return (
    <View style={[styles.root, { paddingTop: insets.top + 12, backgroundColor: colors.background }]}>
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
        contentContainerStyle={[styles.list, { paddingBottom: fabBottom + FAB_SIZE + 16 }]}
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
        bottom={fabBottom}
        onPress={() => router.push('/capture/record' as Href)}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
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
