import { Href, router } from 'expo-router';
import { Mic } from 'lucide-react-native';
import { useMemo, useState } from 'react';
import { Dimensions, Platform, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { DEMO_BOBBLE } from '@/src/components/capture/summary-content';
import { HomeHeader } from '@/src/components/home/home-header';
import { QuickActionTile } from '@/src/components/home/quick-action-tile';
import { RecentBobbleRow } from '@/src/components/home/recent-bobble-row';
import { DUMMY_FOCUS_TASKS, TodayFocusCard } from '@/src/components/home/today-focus-card';
import { TodayProgressCard } from '@/src/components/home/today-progress-card';
import { BobbleMascot } from '@/src/components/onboarding/bobble-mascot';
import { PrimaryButton } from '@/src/components/onboarding/primary-button';
import { useBobbleColors } from '@/src/hooks/use-bobble-colors';
import { CaptureKind, useCaptureStore } from '@/src/store/capture-store';
import { Typography } from '@/src/theme/fonts';

function getProgressSubtitle(completed: number, total: number) {
  if (total === 0) return 'Your day is just beginning, record your first Bobble.';
  if (completed === 0) return 'Start with one small task, Bobble will celebrate the rest.';
  if (completed >= total) return 'All done — Bobble is proud of you today.';
  return 'Nice progress — keep the momentum going.';
}

const TAB_BAR_CLEARANCE = 100;

const QUICK_ACTIONS = [
  {
    id: 'idea',
    label: 'Idea',
    icon: require('@/src/assets/images/quick-action-idea.png'),
  },
  {
    id: 'task',
    label: 'Task',
    icon: require('@/src/assets/images/quick-action-task.png'),
  },
  {
    id: 'brain-dump',
    label: 'Brain Dump',
    icon: require('@/src/assets/images/quick-action-brain-dump.png'),
  },
  {
    id: 'reflection',
    label: 'Reflection',
    icon: require('@/src/assets/images/quick-action-reflection.png'),
  },
] as const satisfies ReadonlyArray<{
  id: CaptureKind;
  label: string;
  icon: number;
}>;

function getGreeting() {
  const hour = new Date().getHours();
  if (hour < 12) return 'Good morning';
  if (hour < 17) return 'Good afternoon';
  return 'Good evening';
}

export default function HomeScreen() {
  const insets = useSafeAreaInsets();
  const colors = useBobbleColors();
  const setCaptureKind = useCaptureStore((state) => state.setCaptureKind);
  const [completedIds, setCompletedIds] = useState<Set<string>>(() => new Set());

  const focusTasks = useMemo(
    () =>
      DUMMY_FOCUS_TASKS.map((task) => ({
        ...task,
        done: completedIds.has(task.id),
      })),
    [completedIds],
  );
  const completedCount = completedIds.size;
  const totalCount = DUMMY_FOCUS_TASKS.length;

  const toggleFocusTask = (id: string) => {
    setCompletedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const startCapture = (kind: CaptureKind = 'bobble') => {
    setCaptureKind(kind);
    router.push('/capture/record' as Href);
  };

  return (
    <View style={[styles.root, { paddingTop: insets.top + 8 }]}>
      <ScrollView
        contentContainerStyle={[
          styles.scrollContent,
          { paddingBottom: insets.bottom + TAB_BAR_CLEARANCE },
        ]}
        showsVerticalScrollIndicator={false}
      >
        <HomeHeader
          greeting={getGreeting()}
          name="Steven"
          onProfilePress={() => router.push('/(tabs)/profile' as Href)}
        />

        <View style={styles.mascotWrap}>
          <BobbleMascot
            variant="home"
            size={Math.round(
              Dimensions.get('window').width * (Platform.OS === 'android' ? 1.25 : 1.15),
            )}
          />
        </View>

        <View style={styles.section}>
          <PrimaryButton
            label="Start a Bobble"
            onPress={() => startCapture('bobble')}
            icon={Mic}
            showChevron={false}
            style={styles.primaryButton}
          />
        </View>

        <View style={styles.quickActions}>
          {QUICK_ACTIONS.map((action) => (
            <QuickActionTile
              key={action.id}
              label={action.label}
              icon={action.icon}
              iconSize={action.id === 'task' ? 34 : undefined}
              onPress={() => startCapture(action.id)}
            />
          ))}
        </View>

        <View style={styles.todayRow}>
          <TodayFocusCard tasks={focusTasks} onToggle={toggleFocusTask} />
          <TodayProgressCard
            completed={completedCount}
            total={totalCount}
            subtitle={getProgressSubtitle(completedCount, totalCount)}
          />
        </View>

        <View style={styles.recentSection}>
          <View style={styles.recentHeader}>
            <Text style={[styles.recentTitle, { color: colors.text }]}>Recent Bobbles</Text>
            <Pressable onPress={() => router.push('/(tabs)/bobbles' as Href)} hitSlop={8}>
              <Text style={[styles.seeAll, { color: colors.primary }]}>See all</Text>
            </Pressable>
          </View>
          <RecentBobbleRow
            title={DEMO_BOBBLE.title}
            timestamp="Today 8:30 AM"
            onPress={() => router.push({ pathname: '/bobble/[id]', params: { id: '1' } } as Href)}
          />
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 10,
  },
  mascotWrap: {
    alignItems: 'center',
    marginTop: 4,
    marginBottom: 12,
  },
  section: {
    width: '95%',
    alignSelf: 'center',
    marginBottom: 14,
  },
  primaryButton: {
    width: '100%',
  },
  quickActions: {
    flexDirection: 'row',
    gap: 10,
    width: '95%',
    alignSelf: 'center',
    marginBottom: 14,
  },
  todayRow: {
    flexDirection: 'row',
    gap: 10,
    width: '95%',
    alignSelf: 'center',
    marginBottom: 24,
    maxHeight: '25%'
  },
  recentSection: {
    gap: 12,
    width: '95%',
    alignSelf: 'center',
  },
  recentHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  recentTitle: {
    ...Typography.formLabel,
    fontSize: 16,
    fontFamily: Typography.button.fontFamily,
  },
  seeAll: {
    ...Typography.caption,
    fontFamily: Typography.button.fontFamily,
  },
});
