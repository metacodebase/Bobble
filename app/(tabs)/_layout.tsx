import { Tabs } from 'expo-router';
import React from 'react';
import { StyleSheet, View } from 'react-native';
import { CalendarDays, CircleUserRound, House, ListTodo, Sparkles } from 'lucide-react-native';

import { HapticTab } from '@/src/components/haptic-tab';
import { useBobbleColors } from '@/src/hooks/use-bobble-colors';
import { useTabBarInsets } from '@/src/hooks/use-tab-bar-insets';
import { Colors } from '@/src/theme';
import { FontFamily } from '@/src/theme/fonts';
import { useColorScheme } from '@/src/hooks/use-color-scheme';

function TabIcon({
  Icon,
  color,
  focused,
}: {
  Icon: React.ComponentType<{ size: number; color: string; strokeWidth?: number }>;
  color: string | undefined;
  focused: boolean;
}) {
  return (
    <View style={styles.iconWrapper}>
      <Icon size={24} color={String(color)} strokeWidth={focused ? 2.2 : 1.8} />
    </View>
  );
}

const TAB_BAR_PADDING_TOP = 10;

export default function TabLayout() {
  const colorScheme = useColorScheme();
  const theme = Colors[colorScheme ?? 'light'];
  const colors = useBobbleColors();
  const { bottomPadding, height: tabBarHeight } = useTabBarInsets();

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarButton: (props) => <HapticTab {...(props as React.ComponentProps<typeof HapticTab>)} />,
        tabBarActiveTintColor: theme.tabIconSelected,
        tabBarInactiveTintColor: theme.tabIconDefault,
        tabBarStyle: {
          backgroundColor: colors.background,
          borderTopColor: colors.border,
          borderTopWidth: StyleSheet.hairlineWidth,
          height: tabBarHeight,
          paddingTop: TAB_BAR_PADDING_TOP,
          paddingBottom: bottomPadding,
        },
        tabBarLabelStyle: {
          fontFamily: FontFamily.regular,
          fontSize: 11,
          marginTop: 4,
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: 'Home',
          tabBarIcon: ({ color, focused }) => (
            <TabIcon Icon={House} color={color as string} focused={focused} />
          ),
        }}
      />
      <Tabs.Screen
        name="bobbles"
        options={{
          title: 'Bobbles',
          tabBarIcon: ({ color, focused }) => (
            <TabIcon Icon={Sparkles} color={color as string} focused={focused} />
          ),
        }}
      />
      <Tabs.Screen
        name="tasks"
        options={{
          title: 'Tasks',
          tabBarIcon: ({ color, focused }) => (
            <TabIcon Icon={ListTodo} color={color as string} focused={focused} />
          ),
        }}
      />
      <Tabs.Screen
        name="calendar"
        options={{
          title: 'Calendar',
          tabBarIcon: ({ color, focused }) => (
            <TabIcon Icon={CalendarDays} color={color as string} focused={focused} />
          ),
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: 'Profile',
          tabBarIcon: ({ color, focused }) => (
            <TabIcon Icon={CircleUserRound} color={color as string} focused={focused} />
          ),
        }}
      />
      <Tabs.Screen name="account" options={{ href: null }} />
    </Tabs>
  );
}

const styles = StyleSheet.create({
  iconWrapper: {
    alignItems: 'center',
    justifyContent: 'center',
  },
});
