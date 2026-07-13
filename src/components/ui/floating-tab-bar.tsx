import { Feather, FontAwesome, Octicons } from '@expo/vector-icons';
import { BottomTabBarProps } from '@react-navigation/bottom-tabs';
import { BlurView } from 'expo-blur';
import {
  GlassView,
  isGlassEffectAPIAvailable,
  isLiquidGlassAvailable,
} from 'expo-glass-effect';
import { Href, router } from 'expo-router';
import { Platform, Pressable, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { BobblesTabIcon } from '@/src/components/ui/bobbles-tab-icon';
import { TAB_ICON_SIZE } from '@/src/components/ui/tab-bar-icons';
import { useBobbleColors } from '@/src/hooks/use-bobble-colors';
import { useColorScheme } from '@/src/hooks/use-color-scheme';
import { useCaptureStore } from '@/src/store/capture-store';
import { BobbleColors } from '@/src/theme/colors';
import { FontFamily } from '@/src/theme/fonts';

type TabConfig = {
  name: string;
  label: string;
  renderIcon: (focused: boolean, color: string) => React.ReactNode;
};

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
              { backgroundColor: isDark ? 'rgba(0,0,0,0.3)' : 'rgba(255,255,255,0.3)' }
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
  const insets = useSafeAreaInsets();
  const scheme = useColorScheme();
  const colors = useBobbleColors();
  const setCaptureKind = useCaptureStore((state) => state.setCaptureKind);
  const glassEnabled = useLiquidGlassTabBar();
  const bottom = Math.max(insets.bottom, 10);

  const tabs: TabConfig[] = [
    {
      name: 'index',
      label: 'Home',
      renderIcon: (_focused, color) => (
        <Feather name="home" size={TAB_ICON_SIZE} color={color} />
      ),
    },
    {
      name: 'bobbles',
      label: 'Bobbles',
      renderIcon: (focused) => <BobblesTabIcon focused={focused} size={TAB_ICON_SIZE} />,
    },
    {
      name: 'tasks',
      label: 'Tasks',
      renderIcon: (_focused, color) => (
        <Feather name="check-circle" size={TAB_ICON_SIZE} color={color} />
      ),
    },
    {
      name: 'profile',
      label: 'Profile',
      renderIcon: (_focused, color) => (
        <Octicons name="person" size={TAB_ICON_SIZE} color={color} />
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
        glassEnabled={glassEnabled}
        colorScheme={scheme === 'dark' ? 'dark' : 'light'}
        isDark={scheme === 'dark'}
        surfaceColor={colors.surface}
      >
        {slots.map((slot) => {
          if (slot.type === 'mic') {
            return (
              <View key="mic" style={styles.micSlot}>
                <Pressable
                  onPress={() => {
                    setCaptureKind('bobble');
                    router.push('/capture/record' as Href);
                  }}
                  style={styles.micHitArea}
                >
                  {({ pressed }) => (
                    <View style={[styles.micButton, pressed && styles.micPressed]}>
                      <FontAwesome
                        name="microphone"
                        size={TAB_ICON_SIZE}
                        color={BobbleColors.textOnPrimary}
                      />
                    </View>
                  )}
                </Pressable>
              </View>
            );
          }

          const { tab } = slot;
          const isFocused = activeRoute === tab.name;
          const color = isFocused ? colors.primary : colors.textSecondary;

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
                    {tab.renderIcon(isFocused, color)}
                    <Text style={[styles.label, { color }]}>{tab.label}</Text>
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
    overflow: 'visible',
  },
  bar: {
    position: 'relative',
    minHeight: 64,
    borderRadius: 32,
    overflow: 'visible',
  },
  barBorderLight: {
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.72)',
  },
  barBorderDark: {
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.14)',
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
    overflow: 'visible',
  },
  slot: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'flex-end',
    height: 48,
  },
  micSlot: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'flex-end',
    height: 40,
    overflow: 'visible',
    zIndex: 10,
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
  label: {
    fontFamily: FontFamily.regular,
    fontSize: 11,
  },
  micHitArea: {
    position: 'absolute',
    top: -28,
    width: 60,
    height: 60,
    alignItems: 'center',
    justifyContent: 'center',

  },
  micButton: {
    width: 65,
    height: 65,
    borderRadius: 108,
    backgroundColor: BobbleColors.primary,
    alignItems: 'center',
    justifyContent: 'center',

  },
  micPressed: {
    opacity: 0.92,
    transform: [{ scale: 0.92 }],
  },
});
