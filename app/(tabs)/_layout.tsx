import { router, Tabs } from 'expo-router';
import React, { useEffect, useMemo, useRef, useState } from 'react';

import { AppBackground, useAppBackdrop } from '@/src/components/ui/app-background';
import { OverdueTaskGate } from '@/src/components/tasks/overdue-task-gate';
import { FloatingTabBar } from '@/src/components/ui/floating-tab-bar';
import { getIncompleteOverdueTasks } from '@/src/features/tasks/adapter';
import { useTasks } from '@/src/hooks/tasks';

function StartupOverdueGate() {
  const { data: overdueTasks = [], isSuccess } = useTasks('overdue');
  const [visible, setVisible] = useState(false);
  const checkedThisLaunch = useRef(false);
  const incompleteOverdueTasks = useMemo(
    () => getIncompleteOverdueTasks(overdueTasks),
    [overdueTasks],
  );

  useEffect(() => {
    if (!isSuccess || checkedThisLaunch.current) return;
    checkedThisLaunch.current = true;
    if (incompleteOverdueTasks.length > 0) setVisible(true);
  }, [incompleteOverdueTasks.length, isSuccess]);

  return (
    <OverdueTaskGate
      visible={visible}
      count={incompleteOverdueTasks.length}
      oldestDueAt={incompleteOverdueTasks[0]?.dueAt}
      onReview={() => {
        setVisible(false);
        router.push({ pathname: '/(tabs)/tasks', params: { filter: 'overdue' } });
      }}
    />
  );
}

export default function TabLayout() {
  const { color } = useAppBackdrop();

  return (
    <>
      <Tabs
        tabBar={(props) => <FloatingTabBar {...props} />}
        screenLayout={({ children }) => <AppBackground>{children}</AppBackground>}
        screenOptions={{
          headerShown: false,
          animation: 'none',
          freezeOnBlur: true,
          // Opaque scene prevents Android from flashing the previous tab through
          // transparent navigator chrome during attach/detach.
          sceneStyle: {
            backgroundColor: color,
          },
          tabBarStyle: {
            position: 'absolute',
            backgroundColor: 'transparent',
            borderTopWidth: 0,
            elevation: 0,
          },
        }}
      >
        <Tabs.Screen name="index" options={{ title: 'Home' }} />
        <Tabs.Screen name="bobbles" options={{ title: 'Bobbles' }} />
        <Tabs.Screen name="brain-map" options={{ title: 'Brain Map' }} />
        <Tabs.Screen name="tasks" options={{ title: 'Tasks' }} />
        <Tabs.Screen name="profile" options={{ title: 'Profile' }} />
        <Tabs.Screen name="calendar" options={{ href: null }} />
        <Tabs.Screen name="account" options={{ href: null }} />
      </Tabs>
      <StartupOverdueGate />
    </>
  );
}
