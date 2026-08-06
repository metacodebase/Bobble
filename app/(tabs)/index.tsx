import { Href, router } from 'expo-router';
import { Mic } from 'lucide-react-native';
import { useMemo, useState } from 'react';
import { Platform, ScrollView, StyleSheet, useWindowDimensions, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { HomeHeader } from '@/src/components/home/home-header';
import { QuickActionTile } from '@/src/components/home/quick-action-tile';
import { TodayFocusCard } from '@/src/components/home/today-focus-card';
import { TodayProgressCard } from '@/src/components/home/today-progress-card';
import { BobbleMascot, type HomeVariant } from '@/src/components/onboarding/bobble-mascot';
import { PrimaryButton } from '@/src/components/onboarding/primary-button';
import { OverdueTaskGate } from '@/src/components/tasks/overdue-task-gate';
import { FREE_BOBBLE_LIMIT } from '@/src/config/subscription';
import { getIncompleteOverdueTasks } from '@/src/features/tasks/adapter';
import { useProfile } from '@/src/hooks/profile';
import { useTasks, useToggleTask } from '@/src/hooks/tasks';
import { useIsPro } from '@/src/hooks/use-subscription';
import { useTabBarInsets } from '@/src/hooks/use-tab-bar-insets';
import { useAppStore } from '@/src/store/app-store';
import { CaptureKind, useCaptureStore } from '@/src/store/capture-store';
import { resolveAvatarUrl } from '@/src/utils/avatar-url';
import { getDayPeriod, getGreeting } from '@/src/utils/day-period';
import { androidSafeTop } from '@/src/utils/safe-padding';
import { toast } from '@/src/utils/toast';

function getProgressSubtitle(completed: number, total: number) {
  if (total === 0) return 'Your day is just beginning, record your first Bobble.';
  if (completed === 0) return 'Start with one small task, Bobble will organize the rest.';
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
  const { height: windowHeight, width: windowWidth } = useWindowDimensions();
  const { height: tabBarHeight } = useTabBarInsets();
  const setCaptureKind = useCaptureStore((state) => state.setCaptureKind);
  const clearRecording = useCaptureStore((state) => state.clearRecording);
  const storeUser = useAppStore((s) => s.user);
  const isPro = useIsPro();
  const { data: profile } = useProfile();
  const displayName =
    profile?.user.name?.split(' ')[0] ?? storeUser?.name?.split(' ')[0] ?? 'there';
  const avatarUrl = resolveAvatarUrl(profile?.user.avatarUrl, storeUser?.avatarUrl);
  const { data: todayTasks = [] } = useTasks('today');
  const { data: overdueTasks = [] } = useTasks('overdue');
  const toggleTask = useToggleTask();
  const [showOverdueGate, setShowOverdueGate] = useState(false);

  const incompleteOverdueTasks = useMemo(
    () => getIncompleteOverdueTasks(overdueTasks),
    [overdueTasks],
  );

  const focusTasks = useMemo(
    () =>
      todayTasks.map((task) => ({
        id: task._id,
        title: task.title,
        done: task.done,
      })),
    [todayTasks],
  );
  const completedCount = todayTasks.filter((task) => task.done).length;
  const totalCount = todayTasks.length;
  const homeMascotVariant = getHomeMascotVariant();
  const [focusListScrolling, setFocusListScrolling] = useState(false);
  const todayRowHeight = Math.max(172, Math.min(Math.round(windowHeight * 0.24), 240));
  const bottomPadding = tabBarHeight + 24;

  const startCapture = (kind: CaptureKind = 'bobble') => {
    if (incompleteOverdueTasks.length > 0) {
      setShowOverdueGate(true);
      return;
    }
    const bobbleCount =
      profile?.stats.bobbles ?? storeUser?.gamification?.bobbles ?? 0;
    if (!isPro && bobbleCount >= FREE_BOBBLE_LIMIT) {
      toast.error(
        `Free plan allows up to ${FREE_BOBBLE_LIMIT} Bobbles. Upgrade to Bobble Pro for unlimited captures.`
      );
      router.push('/paywall' as Href);
      return;
    }
    setCaptureKind(kind);
    clearRecording();
    router.push('/capture/record' as Href);
  };

  return (
    <View style={[styles.root, { paddingTop: androidSafeTop(insets.top) + (Platform.OS === 'android' ? 0 : -10) }]}>
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={[
          styles.scrollContent,
          { flexGrow: 1, paddingBottom: bottomPadding },
        ]}
        showsVerticalScrollIndicator={false}
        scrollEnabled={!focusListScrolling}
      >
        <View style={styles.headerSection}>
          <HomeHeader
            greeting={getGreeting()}
            name={displayName}
            avatarUrl={avatarUrl}
            onProfilePress={() => router.push('/(tabs)/profile' as Href)}
          />
        </View>

        <View style={styles.mascotWrap}>
          <BobbleMascot
            variant="home"
            homeVariant={homeMascotVariant}
            size={Math.round(windowWidth * (Platform.OS === 'android' ? 1.05 : 0.95))}
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

        <View style={styles.flexSpacer} />

        <View style={[styles.todayRow, { minHeight: todayRowHeight }]}>
          <TodayFocusCard
            tasks={focusTasks}
            onToggle={(id) => toggleTask.mutate(id)}
            emptyMessage="No tasks due today."
            onParentScrollLockChange={setFocusListScrolling}
          />
          <TodayProgressCard
            completed={completedCount}
            total={totalCount}
            subtitle={getProgressSubtitle(completedCount, totalCount)}
          />
        </View>
      </ScrollView>

      <OverdueTaskGate
        visible={showOverdueGate}
        count={incompleteOverdueTasks.length}
        oldestDueAt={incompleteOverdueTasks[0]?.dueAt}
        onReview={() => {
          setShowOverdueGate(false);
          router.push({ pathname: '/(tabs)/tasks', params: { filter: 'overdue' } });
        }}
      />
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
  scroll: {
    flex: 1,
  },
  flexSpacer: {
    flex: 1,
    minHeight: 16,
  },
  headerSection: {
    width: '95%',
    alignSelf: 'center',
  },
  mascotWrap: {
    alignItems: 'center',
    marginBottom: 5
  },
  section: {
    width: '95%',
    alignSelf: 'center',
    marginBottom: 10,
  },
  primaryButton: {
    width: '100%',
  },
  quickActions: {
    flexDirection: 'row',
    gap: 10,
    width: '95%',
    alignSelf: 'center',
    marginBottom: 10,
  },
  todayRow: {
    flexDirection: 'row',
    gap: 10,
    width: '95%',
    alignSelf: 'center',
    marginBottom: 24,
  },
});
