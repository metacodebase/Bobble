import { Image } from 'expo-image';
import { Href, router } from 'expo-router';
import { CalendarDays, X } from 'lucide-react-native';
import { useMemo, useState } from 'react';
import { Modal, Pressable, RefreshControl, ScrollView, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { MindMapClusterView } from '@/src/components/brain-map/mind-map-cluster';
import { DateRangeFilter } from '@/src/components/brain-map/date-range-filter';
import { PinchZoomMindMap } from '@/src/components/brain-map/pinch-zoom-mind-map';
import type {
  CustomDateRange,
  MindMapDateFilter,
} from '@/src/components/brain-map/date-range-filter';
import { PrimaryButton } from '@/src/components/onboarding/primary-button';
import { AppBackground } from '@/src/components/ui/app-background';
import { ScreenLoading } from '@/src/components/ui/screen-loading';
import { DEMO_MIND_MAP } from '@/src/data/demo-data';
import type { MindMapCluster } from '@/src/features/mind-map/types';
import { useMindMapClusters } from '@/src/hooks/mind-map';
import { useBobbleColors } from '@/src/hooks/use-bobble-colors';
import { useNightForeground } from '@/src/hooks/use-night-foreground';
import { useIsPro } from '@/src/hooks/use-subscription';
import { useTabBarInsets } from '@/src/hooks/use-tab-bar-insets';
import { Typography } from '@/src/theme/fonts';

const MINDMAP_ICON = require('@/src/assets/images/tab-icons/mindmap-active.png');

function clusterDate(cluster: MindMapCluster) {
  const rawDate = cluster.captureAt || cluster.createdAt;
  if (!rawDate) return null;
  const date = new Date(rawDate);
  return Number.isNaN(date.getTime()) ? null : date;
}

function startOfDay(date: Date) {
  return new Date(date.getFullYear(), date.getMonth(), date.getDate());
}

function dateBounds(filter: MindMapDateFilter, customRange: CustomDateRange) {
  const today = startOfDay(new Date());
  if (filter === 'week') {
    const start = new Date(today);
    start.setDate(today.getDate() - today.getDay());
    const end = new Date(start);
    end.setDate(start.getDate() + 7);
    return { start, end };
  }
  if (filter === 'month') {
    return {
      start: new Date(today.getFullYear(), today.getMonth(), 1),
      end: new Date(today.getFullYear(), today.getMonth() + 1, 1),
    };
  }
  if (filter === 'custom' && customRange) {
    const end = new Date(customRange.end);
    end.setDate(end.getDate() + 1);
    return { start: customRange.start, end };
  }
  return null;
}

const DEMO_CLUSTERS: MindMapCluster[] = [
  {
    _id: 'mind-map-demo-day-1',
    user: 'demo',
    sourceBobbleId: 'demo-bobble-day-1',
    captureAt: '',
    centerTitle: 'Jul 21',
    bobbleTitleSnapshot: 'Fitness goals & first steps',
    taskNodes: DEMO_MIND_MAP.nodes.slice(0, 3),
    createdAt: '',
    updatedAt: '',
  },
  {
    _id: 'mind-map-demo-day-2',
    user: 'demo',
    sourceBobbleId: 'demo-bobble-day-2',
    captureAt: '',
    centerTitle: 'Jul 24',
    bobbleTitleSnapshot: 'Building a consistent routine',
    taskNodes: [
      {
        id: 'schedule',
        title: 'Schedule',
        subtitle: 'Morning workouts',
        backgroundColor: '#EDE9FE',
        lineColor: '#C4B5FD',
        position: 'top',
      },
      {
        id: 'meal-prep',
        title: 'Meal prep',
        subtitle: 'Plan balanced meals',
        backgroundColor: '#DCFCE7',
        lineColor: '#86EFAC',
        position: 'left',
      },
      {
        id: 'progress',
        title: 'Progress',
        subtitle: 'Track each session',
        backgroundColor: '#DBEAFE',
        lineColor: '#93C5FD',
        position: 'right',
      },
      {
        id: 'rest',
        title: 'Recovery',
        subtitle: 'Sleep & stretching',
        backgroundColor: '#FCE7F3',
        lineColor: '#F9A8D4',
        position: 'bottom-right',
      },
    ],
    createdAt: '',
    updatedAt: '',
  },
  {
    _id: 'mind-map-demo-day-3',
    user: 'demo',
    sourceBobbleId: 'demo-bobble-day-3',
    captureAt: '',
    centerTitle: 'Aug 2',
    bobbleTitleSnapshot: 'Reviewing progress & staying motivated',
    taskNodes: [
      {
        id: 'wins',
        title: 'Wins',
        subtitle: 'Celebrate progress',
        backgroundColor: '#EDE9FE',
        lineColor: '#C4B5FD',
        position: 'top',
      },
      {
        id: 'energy',
        title: 'Energy',
        subtitle: 'Notice how you feel',
        backgroundColor: '#FEF9C3',
        lineColor: '#FDE047',
        position: 'left',
      },
      {
        id: 'adjustments',
        title: 'Adjustments',
        subtitle: 'Refine the routine',
        backgroundColor: '#DBEAFE',
        lineColor: '#93C5FD',
        position: 'right',
      },
      {
        id: 'next-goal',
        title: 'Next goal',
        subtitle: 'Plan the next step',
        backgroundColor: '#DCFCE7',
        lineColor: '#86EFAC',
        position: 'bottom-left',
      },
      {
        id: 'reflection',
        title: 'Reflection',
        subtitle: 'Keep what works',
        backgroundColor: '#FCE7F3',
        lineColor: '#F9A8D4',
        position: 'bottom-right',
      },
    ],
    createdAt: '',
    updatedAt: '',
  },
];

export default function BrainMapScreen() {
  const insets = useSafeAreaInsets();
  const colors = useBobbleColors();
  const night = useNightForeground();
  const [showDemo, setShowDemo] = useState(false);
  const [dateFilter, setDateFilter] = useState<MindMapDateFilter>('all');
  const [customRange, setCustomRange] = useState<CustomDateRange>(null);
  const { height: tabBarHeight } = useTabBarInsets();
  const isPro = useIsPro();
  const { data: clusters, isLoading, isRefetching, refetch } = useMindMapClusters(isPro);
  const filteredClusters = useMemo(() => {
    if (!clusters || dateFilter === 'all') return clusters ?? [];
    const bounds = dateBounds(dateFilter, customRange);
    if (!bounds) return clusters;
    return clusters.filter((cluster) => {
      const date = clusterDate(cluster);
      return date ? date >= bounds.start && date < bounds.end : false;
    });
  }, [clusters, customRange, dateFilter]);

  const changeDateFilter = (filter: MindMapDateFilter, range?: CustomDateRange) => {
    setDateFilter(filter);
    if (range !== undefined) setCustomRange(range);
  };

  return (
    <View
      style={[
        styles.root,
        {
          paddingTop: insets.top + 8,
          paddingBottom: tabBarHeight + 8,
        },
      ]}
    >
      <View style={styles.header}>
        <Text style={[styles.headerTitle, { color: night.text ?? colors.text }]}>Brain Map</Text>
        {!isPro ? (
          <Pressable
            accessibilityRole="button"
            accessibilityLabel="Show a mind map demo"
            onPress={() => setShowDemo(true)}
            style={({ pressed }) => [
              styles.demoButton,
              { backgroundColor: colors.surface, borderColor: colors.border },
              pressed && styles.pressed,
            ]}
          >
            <Text style={[styles.demoButtonText, { color: colors.primary }]}>Check the demo</Text>
          </Pressable>
        ) : null}
      </View>

      {!isPro ? (
        <View style={styles.empty}>
          <View style={[styles.iconWrap, { backgroundColor: colors.surface }]}>
            <Image source={MINDMAP_ICON} style={styles.icon} contentFit="contain" />
          </View>
          <Text style={[styles.title, { color: night.text ?? colors.text }]}>
            Mind Maps & Insights
          </Text>
          <Text style={[styles.subtitle, { color: night.textSecondary ?? colors.textSecondary }]}>
            Upgrade to Bobble Pro to unlock mind maps and deeper insights from your captures.
          </Text>
          <PrimaryButton
            label="Unlock Bobble Pro"
            onPress={() => router.push('/paywall' as Href)}
            style={styles.cta}
            showChevron={false}
          />
        </View>
      ) : isLoading ? (
        <ScreenLoading label="Loading your brain map…" />
      ) : !clusters?.length ? (
        <View style={styles.empty}>
          <View style={[styles.iconWrap, { backgroundColor: colors.surface }]}>
            <Image source={MINDMAP_ICON} style={styles.icon} contentFit="contain" />
          </View>
          <Text style={[styles.title, { color: night.text ?? colors.text }]}>Your Brain Map</Text>
          <Text style={[styles.subtitle, { color: night.textSecondary ?? colors.textSecondary }]}>
            Create tasks from a Bobble to grow your map. Each capture day becomes a node with its
            tasks around it.
          </Text>
        </View>
      ) : (
        <View style={styles.mapContent}>
          <DateRangeFilter
            value={dateFilter}
            customRange={customRange}
            onChange={changeDateFilter}
          />
          {filteredClusters.length ? (
            <ScrollView
              contentContainerStyle={styles.scrollContent}
              showsVerticalScrollIndicator={false}
              refreshControl={
                <RefreshControl
                  refreshing={isRefetching && !isLoading}
                  onRefresh={() => void refetch()}
                  tintColor={colors.primary}
                />
              }
            >
              <PinchZoomMindMap>
                {filteredClusters.map((cluster, index) => (
                  <MindMapClusterView
                    key={cluster._id}
                    cluster={cluster}
                    showConnectorBelow={index < filteredClusters.length - 1}
                  />
                ))}
              </PinchZoomMindMap>
            </ScrollView>
          ) : (
            <View style={styles.filteredEmpty}>
              <CalendarDays size={40} color={colors.primary} />
              <Text style={[styles.title, { color: night.text ?? colors.text }]}>
                No bobbles here
              </Text>
              <Text
                style={[styles.subtitle, { color: night.textSecondary ?? colors.textSecondary }]}
              >
                Try another time period or choose different dates.
              </Text>
              <Pressable
                accessibilityRole="button"
                onPress={() => setDateFilter('all')}
                style={[styles.showAllButton, { backgroundColor: colors.primary }]}
              >
                <Text style={styles.showAllText}>Show all bobbles</Text>
              </Pressable>
            </View>
          )}
        </View>
      )}

      <Modal visible={showDemo} animationType="slide" onRequestClose={() => setShowDemo(false)}>
        <AppBackground>
          <View
            style={[
              styles.modalRoot,
              {
                paddingTop: insets.top + 12,
                paddingBottom: insets.bottom,
              },
            ]}
          >
            <View style={styles.demoHeader}>
              <View style={styles.demoHeaderCopy}>
                <Text style={[styles.demoTitle, { color: night.text ?? colors.text }]}>
                  Mind map demo
                </Text>
                <Text
                  style={[
                    styles.demoSubtitle,
                    { color: night.textSecondary ?? colors.textSecondary },
                  ]}
                >
                  See how your ideas grow and connect across days.
                </Text>
              </View>
              <Pressable
                accessibilityRole="button"
                accessibilityLabel="Close mind map demo"
                hitSlop={10}
                onPress={() => setShowDemo(false)}
                style={({ pressed }) => [
                  styles.closeButton,
                  { backgroundColor: night.isNight ? 'rgba(255, 255, 255, 0.16)' : colors.surface },
                  pressed && styles.pressed,
                ]}
              >
                <X
                  size={20}
                  color={night.textSecondary ?? colors.textSecondary}
                  strokeWidth={2.2}
                />
              </Pressable>
            </View>
            <ScrollView
              contentContainerStyle={styles.demoContent}
              showsVerticalScrollIndicator={false}
            >
              <PinchZoomMindMap>
                {DEMO_CLUSTERS.map((cluster, index) => (
                  <MindMapClusterView
                    key={cluster._id}
                    cluster={cluster}
                    showConnectorBelow={index < DEMO_CLUSTERS.length - 1}
                  />
                ))}
              </PinchZoomMindMap>
            </ScrollView>
          </View>
        </AppBackground>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    paddingHorizontal: 16,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  headerTitle: {
    ...Typography.heading,
    fontSize: 28,
    lineHeight: 36,
  },
  demoButton: {
    minHeight: 38,
    justifyContent: 'center',
    borderRadius: 19,
    borderWidth: StyleSheet.hairlineWidth,
    paddingHorizontal: 16,
  },
  demoButtonText: {
    ...Typography.button,
    fontSize: 14,
    lineHeight: 18,
  },
  scrollContent: {
    alignItems: 'center',
    paddingTop: 8,
    paddingBottom: 24,
    gap: 4,
  },
  mapContent: {
    flex: 1,
  },
  filteredEmpty: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
    paddingBottom: 60,
  },
  showAllButton: {
    minHeight: 42,
    justifyContent: 'center',
    borderRadius: 21,
    marginTop: 4,
    paddingHorizontal: 18,
  },
  showAllText: {
    ...Typography.button,
    color: '#FFFFFF',
    fontSize: 13,
    lineHeight: 17,
  },
  empty: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 12,
    paddingBottom: 40,
    paddingHorizontal: 8,
  },
  iconWrap: {
    width: 88,
    height: 88,
    borderRadius: 44,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
    shadowColor: '#9F52F2',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.12,
    shadowRadius: 12,
    elevation: 3,
  },
  icon: {
    width: 44,
    height: 44,
  },
  title: {
    ...Typography.heading,
    fontSize: 22,
    lineHeight: 28,
    textAlign: 'center',
  },
  subtitle: {
    ...Typography.body,
    fontSize: 15,
    lineHeight: 22,
    textAlign: 'center',
    maxWidth: 300,
  },
  cta: {
    marginTop: 8,
    minWidth: 220,
  },
  modalRoot: {
    flex: 1,
  },
  demoHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    paddingHorizontal: 20,
    paddingBottom: 12,
    gap: 12,
  },
  demoHeaderCopy: {
    flex: 1,
    gap: 3,
  },
  demoTitle: {
    ...Typography.heading,
    fontSize: 22,
    lineHeight: 28,
  },
  demoSubtitle: {
    ...Typography.body,
    fontSize: 13,
    lineHeight: 18,
  },
  closeButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
  },
  demoContent: {
    alignItems: 'center',
    paddingTop: 12,
    paddingBottom: 32,
  },
  pressed: {
    opacity: 0.72,
  },
});
