import * as Haptics from 'expo-haptics';
import { Href, router } from 'expo-router';
import { Trash2 } from 'lucide-react-native';
import { useCallback, useMemo, useState } from 'react';
import { Alert, FlatList, Pressable, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { BOBBLE_FILTER_CHIP_STYLES } from '@/src/components/bobbles/bobble-category-config';
import { BobbleLibraryRow } from '@/src/components/bobbles/bobble-library-row';
import {
  BANNER_AD_RESERVED_HEIGHT,
  SafeBannerAd,
} from '@/src/components/ads/safe-banner-ad';
import { FilterChips } from '@/src/components/ui/filter-chips';
import { ScreenHeader } from '@/src/components/ui/screen-header';
import { ScreenLoading } from '@/src/components/ui/screen-loading';
import { SearchBar } from '@/src/components/ui/search-bar';
import {
  BOBBLE_FILTERS,
  type BobbleFilter,
  filterCategoryFromChip,
  formatBobbleDateLabel,
} from '@/src/features/bobbles/format';
import {
  useArchiveBobble,
  useBobbles,
  useDeleteBobble,
  useDeleteBobblesBulk,
} from '@/src/hooks/bobbles';
import { useBobbleColors } from '@/src/hooks/use-bobble-colors';
import { useAdsState } from '@/src/hooks/use-ads';
import { useNightForeground } from '@/src/hooks/use-night-foreground';
import { useTabBarInsets } from '@/src/hooks/use-tab-bar-insets';
import { Typography } from '@/src/theme/fonts';
import { toast } from '@/src/utils/toast';

export default function BobblesScreen() {
  const insets = useSafeAreaInsets();
  const colors = useBobbleColors();
  const night = useNightForeground();
  const { height: tabBarHeight } = useTabBarInsets();
  const { canRequestAds } = useAdsState();
  const bannerOffset = canRequestAds ? BANNER_AD_RESERVED_HEIGHT : 0;
  const [filter, setFilter] = useState<BobbleFilter>('All');
  const [query, setQuery] = useState('');
  const [selectionMode, setSelectionMode] = useState(false);
  const [selectedIds, setSelectedIds] = useState<Set<string>>(() => new Set());
  const category = filterCategoryFromChip(filter);

  const { data, isLoading, isError, refetch, isRefetching } = useBobbles({
    category,
    search: query.trim() || undefined,
    limit: 50,
  });
  const deleteBobble = useDeleteBobble();
  const deleteBobblesBulk = useDeleteBobblesBulk();
  const archiveBobble = useArchiveBobble();

  const bobbles = useMemo(() => {
    const items = data ?? [];
    return [...items].sort((a, b) => {
      if (Boolean(a.pinned) === Boolean(b.pinned)) return 0;
      return a.pinned ? -1 : 1;
    });
  }, [data]);
  const selectedCount = selectedIds.size;
  const allVisibleSelected =
    bobbles.length > 0 && bobbles.every((bobble) => selectedIds.has(bobble._id));
  const isDeleting = deleteBobble.isPending || deleteBobblesBulk.isPending;

  const exitSelectionMode = useCallback(() => {
    setSelectionMode(false);
    setSelectedIds(new Set());
  }, []);

  const enterSelectionMode = useCallback((id: string) => {
    void Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    setSelectionMode(true);
    setSelectedIds(new Set([id]));
  }, []);

  const toggleSelection = useCallback((id: string) => {
    setSelectedIds((current) => {
      const next = new Set(current);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  }, []);

  const handleSelectAll = useCallback(() => {
    if (allVisibleSelected) {
      setSelectedIds(new Set());
      return;
    }
    setSelectedIds(new Set(bobbles.map((bobble) => bobble._id)));
  }, [allVisibleSelected, bobbles]);

  const handleBulkDelete = useCallback(() => {
    const ids = Array.from(selectedIds);
    if (ids.length === 0 || isDeleting) return;

    Alert.alert(
      'Delete bobbles',
      `Delete ${ids.length} bobble${ids.length === 1 ? '' : 's'}? This cannot be undone.`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: () => {
            deleteBobblesBulk.mutate(ids, {
              onSuccess: () => {
                toast.success(
                  `${ids.length} bobble${ids.length === 1 ? '' : 's'} deleted`,
                );
                exitSelectionMode();
              },
            });
          },
        },
      ],
    );
  }, [deleteBobblesBulk, exitSelectionMode, isDeleting, selectedIds]);

  return (
    <View style={[styles.root, { paddingTop: insets.top + 12 }]}>
      <View style={styles.header}>
        {selectionMode ? (
          <View style={styles.selectionHeader}>
            <Pressable onPress={exitSelectionMode} hitSlop={8} style={styles.headerActionLeft}>
              <Text style={[styles.headerActionText, { color: colors.primary }]}>Cancel</Text>
            </Pressable>
            <Text style={[styles.selectionTitle, { color: night.text ?? colors.text }]}>
              {selectedCount} selected
            </Text>
            <Pressable
              onPress={handleSelectAll}
              hitSlop={8}
              style={styles.headerActionRight}
              disabled={bobbles.length === 0}
            >
              <Text
                style={[
                  styles.headerActionText,
                  { color: bobbles.length === 0 ? colors.textSecondary : colors.primary },
                ]}
              >
                {allVisibleSelected ? 'Deselect all' : 'Select all'}
              </Text>
            </Pressable>
          </View>
        ) : (
          <ScreenHeader title="Bobbles" compact />
        )}
        <SearchBar
          value={query}
          onChangeText={setQuery}
          placeholder="Search Bobbles..."
          editable={!selectionMode}
        />
        <FilterChips
          options={BOBBLE_FILTERS}
          active={filter}
          onChange={setFilter}
          chipStyles={BOBBLE_FILTER_CHIP_STYLES}
          compact
        />
      </View>

      {isLoading ? (
        <ScreenLoading label="Loading bobbles…" />
      ) : isError ? (
        <View style={styles.centered}>
          <Text style={[styles.emptyText, { color: night.textSecondary ?? colors.textSecondary }]}>
            Couldn’t load bobbles.
          </Text>
          <Text style={[styles.retry, { color: colors.primary }]} onPress={() => refetch()}>
            Tap to retry
          </Text>
        </View>
      ) : (
        <FlatList
          data={bobbles}
          keyExtractor={(item) => item._id}
          refreshing={isRefetching}
          onRefresh={refetch}
          contentContainerStyle={[
            styles.list,
            { paddingBottom: tabBarHeight + bannerOffset + 24 },
          ]}
          showsVerticalScrollIndicator={false}
          ItemSeparatorComponent={() => <View style={styles.separator} />}
          ListEmptyComponent={
            <Text style={[styles.emptyText, { color: night.textSecondary ?? colors.textSecondary }]}>
              No bobbles yet — capture one to get started.
            </Text>
          }
          renderItem={({ item }) => (
            <BobbleLibraryRow
              title={item.title}
              timestamp={formatBobbleDateLabel(item.createdAt)}
              category={item.category}
              selectionMode={selectionMode}
              selected={selectedIds.has(item._id)}
              onLongPress={() => enterSelectionMode(item._id)}
              onToggleSelect={() => toggleSelection(item._id)}
              onPress={() =>
                router.push({ pathname: '/bobble/[id]', params: { id: item._id } } as Href)
              }
              onDelete={() => {
                if (isDeleting) return;
                deleteBobble.mutate(item._id, {
                  onSuccess: () => toast.success('Bobble deleted'),
                });
              }}
              onArchive={() => {
                if (archiveBobble.isPending) return;
                archiveBobble.mutate(item._id, {
                  onSuccess: () => toast.success('Bobble archived'),
                });
              }}
              pinned={item.pinned}
            />
          )}
        />
      )}

      <SafeBannerAd style={[styles.adBanner, { bottom: tabBarHeight }]} />

      {selectionMode && selectedCount > 0 ? (
        <Pressable
          onPress={handleBulkDelete}
          disabled={isDeleting}
          accessibilityRole="button"
          accessibilityLabel={`Delete ${selectedCount} bobble${selectedCount === 1 ? '' : 's'}`}
          style={({ pressed }) => [
            styles.bulkDeleteFab,
            {
              bottom: tabBarHeight + 16,
              backgroundColor: colors.error,
            },
            (pressed || isDeleting) && styles.bulkDeletePressed,
          ]}
        >
          <Trash2 size={22} color={colors.textOnPrimary} strokeWidth={2} />
        </Pressable>
      ) : null}
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
  adBanner: {
    position: 'absolute',
    left: 0,
    right: 0,
    alignItems: 'center',
    zIndex: 10,
  },
  selectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    minHeight: 36,
    marginBottom: 4,
  },
  selectionTitle: {
    ...Typography.formLabel,
    fontSize: 16,
  },
  headerActionLeft: {
    minWidth: 88,
    alignItems: 'flex-start',
  },
  headerActionRight: {
    minWidth: 88,
    alignItems: 'flex-end',
  },
  headerActionText: {
    ...Typography.formLabel,
    fontSize: 15,
  },
  list: {
    paddingTop: 4,
    width: '100%',
    alignSelf: 'center',
  },
  separator: {
    height: 12,
  },
  centered: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  emptyText: {
    ...Typography.body,
    textAlign: 'center',
    paddingVertical: 24,
  },
  retry: {
    ...Typography.formLabel,
  },
  bulkDeleteFab: {
    position: 'absolute',
    right: 20,
    width: 56,
    height: 56,
    borderRadius: 28,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#DC2626',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.28,
    shadowRadius: 10,
    elevation: 6,
  },
  bulkDeletePressed: {
    opacity: 0.88,
  },
});
