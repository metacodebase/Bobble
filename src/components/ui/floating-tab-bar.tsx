import { BottomTabBarProps } from '@react-navigation/bottom-tabs';
import { BlurView } from 'expo-blur';
import {
  GlassView,
  isGlassEffectAPIAvailable,
  isLiquidGlassAvailable,
} from 'expo-glass-effect';
import { Image } from 'expo-image';
import { Platform, Pressable, StyleSheet, Text, View } from 'react-native';

import { BobblesTabIcon } from '@/src/components/ui/bobbles-tab-icon';
import { TAB_ICON_SIZE } from '@/src/components/ui/tab-bar-icons';
import { useBobbleColors } from '@/src/hooks/use-bobble-colors';
import { useColorScheme } from '@/src/hooks/use-color-scheme';
import { useTabBarInsets } from '@/src/hooks/use-tab-bar-insets';
import { FontFamily } from '@/src/theme/fonts';

const MINDMAP_ACTIVE = require('@/src/assets/images/tab-icons/mindmap-active.png');
const MINDMAP_INACTIVE = require('@/src/assets/images/tab-icons/mindmap-inactive.png');
const HOME_ACTIVE = require('@/src/assets/images/tab-icons/home-active.png');
const HOME_INACTIVE = require('@/src/assets/images/tab-icons/home-inactive.png');
const TASKS_ACTIVE = require('@/src/assets/images/tab-icons/tasks-active.png');
const TASKS_INACTIVE = require('@/src/assets/images/tab-icons/tasks-inactive.png');
const PROFILE_ACTIVE = require('@/src/assets/images/tab-icons/profile-active.png');
const PROFILE_INACTIVE = require('@/src/assets/images/tab-icons/profile-inactive.png');

type TabConfig = {
  name: string;
  label: string;
  renderIcon: (focused: boolean) => React.ReactNode;
};

function TabBarImageIcon({
  focused,
  activeSource,
  inactiveSource,
}: {
  focused: boolean;
  activeSource: number;
  inactiveSource: number;
}) {
  return (
    <Image
      source={focused ? activeSource : inactiveSource}
      style={styles.tabIcon}
      contentFit="contain"
    />
  );
}

function useLiquidGlassTabBar() {
  if (Platform.OS === 'android') {
    return true;
  }
  return (
    Platform.OS === 'ios' &&
    isGlassEffectAPIAvailable() &&
    isLiquidGlassAvailable()
  );
}

function TabBarSurface({
  children,
  glassEnabled,
  colorScheme,
  isDark,
  surfaceColor,
}: {
  children: React.ReactNode;
  glassEnabled: boolean;
  colorScheme: 'light' | 'dark';
  isDark: boolean;
  surfaceColor: string;
}) {
  return (
    <View style={[styles.bar, isDark ? styles.barBorderDark : styles.barBorderLight]}>
      {glassEnabled ? (
        Platform.OS === 'ios' ? (
          <GlassView
            style={[
              styles.barGlass,
              isDark ? styles.barShadowDark : styles.barShadowLight,
            ]}
            glassEffectStyle="regular"
            isInteractive
            colorScheme={colorScheme}
            pointerEvents="none"
          />
        ) : (
          <BlurView
            style={[
              styles.barGlass,
              isDark ? styles.barShadowDark : styles.barShadowLight,
              { backgroundColor: 'rgba(255,255,255,0.4)' },
            ]}
            tint={colorScheme}
            intensity={0}
            pointerEvents="none"
          />
        )
      ) : (
        <View
          style={[
            styles.barGlass,
            { backgroundColor: surfaceColor },
            isDark ? styles.barShadowDark : styles.barShadowLight,
          ]}
          pointerEvents="none"
        />
      )}
      <View style={styles.barContent}>{children}</View>
    </View>
  );
}

export function FloatingTabBar({ state, navigation }: BottomTabBarProps) {
  const { bottomPadding } = useTabBarInsets();
  const scheme = useColorScheme();
  const colors = useBobbleColors();
  const glassEnabled = useLiquidGlassTabBar();
  // Android: bottomPadding includes system nav / gesture inset so the bar clears it.
  const bottom = bottomPadding;

  const tabs: TabConfig[] = [
    {
      name: 'index',
      label: 'Home',
      renderIcon: (focused) => (
        <TabBarImageIcon
          focused={focused}
          activeSource={HOME_ACTIVE}
          inactiveSource={HOME_INACTIVE}
        />
      ),
    },
    {
      name: 'bobbles',
      label: 'Bobbles',
      renderIcon: (focused) => <BobblesTabIcon focused={focused} size={TAB_ICON_SIZE} />,
    },
    {
      name: 'brain-map',
      label: 'Brain Map',
      renderIcon: (focused) => (
        <TabBarImageIcon
          focused={focused}
          activeSource={MINDMAP_ACTIVE}
          inactiveSource={MINDMAP_INACTIVE}
        />
      ),
    },
    {
      name: 'tasks',
      label: 'Tasks',
      renderIcon: (focused) => (
        <TabBarImageIcon
          focused={focused}
          activeSource={TASKS_ACTIVE}
          inactiveSource={TASKS_INACTIVE}
        />
      ),
    },
    {
      name: 'profile',
      label: 'Profile',
      renderIcon: (focused) => (
        <TabBarImageIcon
          focused={focused}
          activeSource={PROFILE_ACTIVE}
          inactiveSource={PROFILE_INACTIVE}
        />
      ),
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

  return (
    <View style={[styles.wrapper, { bottom }]}>
      <TabBarSurface
        glassEnabled={glassEnabled}
        colorScheme={scheme === 'dark' ? 'dark' : 'light'}
        isDark={scheme === 'dark'}
        surfaceColor={colors.surface}
      >
        {tabs.map((tab) => {
          const isFocused = activeRoute === tab.name;
          const color = isFocused ? colors.primary : colors.text;

          return (
            <View key={tab.name} style={styles.slot}>
              <Pressable
                accessibilityRole="button"
                accessibilityState={isFocused ? { selected: true } : {}}
                onPress={() => navigateTo(tab.name)}
                style={styles.tabHitArea}
              >
                {({ pressed }) => (
                  <View style={[styles.tab, pressed && styles.tabPressed]}>
                    {tab.renderIcon(isFocused)}
                    <Text style={[styles.label, { color }]} numberOfLines={1}>
                      {tab.label}
                    </Text>
                  </View>
                )}
              </Pressable>
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
    position: 'relative',
    minHeight: 64,
    borderRadius: 32,
    overflow: 'hidden',
  },
  barBorderLight: {
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  barBorderDark: {
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.22)',
  },
  barShadowLight: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0,
    shadowRadius: 24,
    elevation: 14,
  },
  barShadowDark: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0,
    shadowRadius: 24,
    elevation: 14,
  },
  barGlass: {
    ...StyleSheet.absoluteFillObject,
    borderRadius: 32,
    overflow: 'hidden',
  },
  barContent: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'space-between',
    minHeight: 64,
    paddingHorizontal: 6,
    paddingTop: 8,
    paddingBottom: 8,
  },
  slot: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'flex-end',
    height: 48,
  },
  tabHitArea: {
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
    height: 48,
  },
  tab: {
    alignItems: 'center',
    justifyContent: 'center',
    gap: 3,
    paddingVertical: 4,
  },
  tabPressed: {
    opacity: 0.75,
    transform: [{ scale: 0.92 }],
  },
  tabIcon: {
    width: TAB_ICON_SIZE,
    height: TAB_ICON_SIZE,
  },
  label: {
    fontFamily: FontFamily.regular,
    fontSize: 11,
  },
});
