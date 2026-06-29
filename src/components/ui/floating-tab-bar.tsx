import { BottomTabBarProps } from '@react-navigation/bottom-tabs';
import { PlatformPressable } from '@react-navigation/elements';
import {
  GlassView,
  isGlassEffectAPIAvailable,
  isLiquidGlassAvailable,
} from 'expo-glass-effect';
import { CircleUserRound, Cloud, ListTodo, Mic } from 'lucide-react-native';
import { Href, router } from 'expo-router';
import { Platform, Pressable, StyleSheet, Text, View, type ViewStyle } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { HomeTabIcon } from '@/src/components/ui/home-tab-icon';
import { useColorScheme } from '@/src/hooks/use-color-scheme';
import { BobbleColors } from '@/src/theme/colors';
import { FontFamily } from '@/src/theme/fonts';

type TabConfig = {
  name: string;
  label: string;
  renderIcon: (focused: boolean, color: string) => React.ReactNode;
};

function useLiquidGlassTabBar() {
  return (
    Platform.OS === 'ios' &&
    isGlassEffectAPIAvailable() &&
    isLiquidGlassAvailable()
  );
}

function TabBarSurface({
  children,
  style,
  glassEnabled,
  colorScheme,
}: {
  children: React.ReactNode;
  style: ViewStyle;
  glassEnabled: boolean;
  colorScheme: 'light' | 'dark';
}) {
  if (glassEnabled) {
    return (
      <GlassView
        style={style}
        glassEffectStyle="regular"
        isInteractive
        colorScheme={colorScheme}
      >
        {children}
      </GlassView>
    );
  }

  return <View style={[style, styles.barFallback]}>{children}</View>;
}

export function FloatingTabBar({ state, navigation }: BottomTabBarProps) {
  const insets = useSafeAreaInsets();
  const scheme = useColorScheme();
  const glassEnabled = useLiquidGlassTabBar();
  const bottom = Math.max(insets.bottom, 10);

  const tabs: TabConfig[] = [
    {
      name: 'index',
      label: 'Home',
      renderIcon: (focused) => <HomeTabIcon focused={focused} />,
    },
    {
      name: 'bobbles',
      label: 'Bobbles',
      renderIcon: (_focused, color) => <Cloud size={24} color={color} strokeWidth={2} />,
    },
    {
      name: 'tasks',
      label: 'Tasks',
      renderIcon: (_focused, color) => <ListTodo size={24} color={color} strokeWidth={2} />,
    },
    {
      name: 'profile',
      label: 'Profile',
      renderIcon: (_focused, color) => <CircleUserRound size={24} color={color} strokeWidth={2} />,
    },
  ];

  const activeRoute = state.routes[state.index]?.name;

  const navigateTo = (name: string) => {
    const route = state.routes.find((r) => r.name === name);
    if (!route) return;

    const event = navigation.emit({
      type: 'tabPress',
      target: route.key,
      canPreventDefault: true,
    });

    if (activeRoute !== name && !event.defaultPrevented) {
      navigation.navigate(name);
    }
  };

  const slots: ({ type: 'tab'; tab: TabConfig } | { type: 'mic' })[] = [
    { type: 'tab', tab: tabs[0] },
    { type: 'tab', tab: tabs[1] },
    { type: 'mic' },
    { type: 'tab', tab: tabs[2] },
    { type: 'tab', tab: tabs[3] },
  ];

  return (
    <View style={[styles.wrapper, { bottom }]}>
      <TabBarSurface
        style={styles.bar}
        glassEnabled={glassEnabled}
        colorScheme={scheme === 'dark' ? 'dark' : 'light'}
      >
        {slots.map((slot) => {
          if (slot.type === 'mic') {
            return (
              <View key="mic" style={styles.slot}>
                <Pressable
                  onPress={() => router.push('/capture/record' as Href)}
                  style={({ pressed }) => [styles.micButton, pressed && styles.micPressed]}
                >
                  <Mic size={26} color={BobbleColors.textOnPrimary} strokeWidth={2.2} />
                </Pressable>
              </View>
            );
          }

          const { tab } = slot;
          const isFocused = activeRoute === tab.name;
          const color = isFocused ? BobbleColors.primary : BobbleColors.textSecondary;

          return (
            <View key={tab.name} style={styles.slot}>
              <PlatformPressable
                accessibilityRole="button"
                accessibilityState={isFocused ? { selected: true } : {}}
                onPress={() => navigateTo(tab.name)}
                style={styles.tab}
              >
                {tab.renderIcon(isFocused, color)}
                <Text style={[styles.label, { color }]}>{tab.label}</Text>
              </PlatformPressable>
            </View>
          );
        })}
      </TabBarSurface>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    position: 'absolute',
    left: 20,
    right: 20,
  },
  bar: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'space-between',
    minHeight: 64,
    borderRadius: 32,
    paddingHorizontal: 6,
    paddingTop: 8,
    paddingBottom: 8,
    overflow: 'hidden',
  },
  barFallback: {
    backgroundColor: BobbleColors.surface,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 16,
    elevation: 10,
  },
  slot: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'flex-end',
    minHeight: 48,
  },
  tab: {
    alignItems: 'center',
    justifyContent: 'center',
    gap: 3,
    paddingVertical: 4,
  },
  label: {
    fontFamily: FontFamily.regular,
    fontSize: 11,
  },
  micButton: {
    position: 'absolute',
    top: -28,
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: BobbleColors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: BobbleColors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.35,
    shadowRadius: 8,
    elevation: 8,
    zIndex: 10,
  },
  micPressed: {
    opacity: 0.92,
    transform: [{ scale: 0.96 }],
  },
});
