import { Href, router } from 'expo-router';
import { Mic } from 'lucide-react-native';
import { useMemo, useState } from 'react';
import { Dimensions, Platform, ScrollView, StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { HomeHeader } from '@/src/components/home/home-header';
import { QuickActionTile } from '@/src/components/home/quick-action-tile';
import { DUMMY_FOCUS_TASKS, TodayFocusCard } from '@/src/components/home/today-focus-card';
import { TodayProgressCard } from '@/src/components/home/today-progress-card';
import { BobbleMascot, type HomeVariant } from '@/src/components/onboarding/bobble-mascot';
import { PrimaryButton } from '@/src/components/onboarding/primary-button';
import { CaptureKind, useCaptureStore } from '@/src/store/capture-store';
import { useAppStore } from '@/src/store/app-store';
import { useProfile } from '@/src/hooks/profile';
import { getDayPeriod, getGreeting } from '@/src/utils/day-period';

function getProgressSubtitle(completed: number, total: number) {
  if (total === 0) return 'Your day is just beginning, record your first Bobble.';
  if (completed === 0) return 'Start with one small task, Bobble will celebrate the rest.';
  if (completed >= total) return 'Congratulations! you completed all your tasks.';
  return 'Nice progress — keep the momentum going.';
}

/** Large dashboard Bobble: morning coffee, afternoon task list, evening cloud. */
function getHomeMascotVariant(): HomeVariant {
  switch (getDayPeriod()) {
    case 'morning':
      return 'default';
    case 'afternoon':
      return 'nerdy';
    case 'evening':
      return 'complete';
  }
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

export default function HomeScreen() {
  const insets = useSafeAreaInsets();
  const setCaptureKind = useCaptureStore((state) => state.setCaptureKind);
  const storeUser = useAppStore((s) => s.user);
  const { data: profile } = useProfile();
  const displayName =
    profile?.user.name?.split(' ')[0] ?? storeUser?.name?.split(' ')[0] ?? 'there';
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
  const homeMascotVariant = getHomeMascotVariant();

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
    <View style={[styles.root, { paddingTop: insets.top + 20 }]}>
      <ScrollView
        contentContainerStyle={[
          styles.scrollContent,
          { paddingBottom: insets.bottom + TAB_BAR_CLEARANCE },
        ]}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.headerSection}>
          <HomeHeader
            greeting={getGreeting()}
            name={displayName}
            onProfilePress={() => router.push('/(tabs)/profile' as Href)}
          />
        </View>

        <View style={styles.mascotWrap}>
          <BobbleMascot
            variant="home"
            homeVariant={homeMascotVariant}
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
  headerSection: {
    width: '95%',
    alignSelf: 'center',
    marginBottom: 4,
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
});
