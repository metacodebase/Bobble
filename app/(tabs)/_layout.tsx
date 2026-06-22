import { Tabs } from 'expo-router';
import React from 'react';
import { Platform, StyleSheet, View } from 'react-native';
import { Home, User } from 'lucide-react-native';

import { HapticTab } from '@/src/components/haptic-tab';
import { Colors } from '@/src/theme';
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
      <Icon size={26} color={String(color)} strokeWidth={focused ? 2 : 1.5} />
    </View>
  );
}

export default function TabLayout() {
  const colorScheme = useColorScheme();
  const theme = Colors[colorScheme ?? 'light'];

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarButton: (props) => <HapticTab {...(props as React.ComponentProps<typeof HapticTab>)} />,
        tabBarActiveTintColor: theme.tabIconSelected,
        tabBarInactiveTintColor: theme.tabIconDefault,
        tabBarStyle: {
          backgroundColor: theme.background,
          borderTopColor: theme.border,
          borderTopWidth: StyleSheet.hairlineWidth,
          height: Platform.OS === 'ios' ? 88 : 68,
          paddingTop: 10,
          paddingBottom: Platform.OS === 'ios' ? 28 : 10,
        },
        tabBarLabelStyle: {
          fontSize: 11,
          fontWeight: '500',
          marginTop: 4,
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: 'Home',
          tabBarIcon: ({ color, focused }) => (
            <TabIcon Icon={Home} color={color as string} focused={focused} />
          ),
        }}
      />
      <Tabs.Screen
        name="account"
        options={{
          title: 'Account',
          tabBarIcon: ({ color, focused }) => (
            <TabIcon Icon={User} color={color as string} focused={focused} />
          ),
        }}
      />
    </Tabs>
  );
}

const styles = StyleSheet.create({
  iconWrapper: {
    alignItems: 'center',
    justifyContent: 'center',
  },
});
