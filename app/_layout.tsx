import { DynaPuff_400Regular } from '@expo-google-fonts/dynapuff';
import {
  Sniglet_400Regular,
  Sniglet_800ExtraBold,
  useFonts,
} from '@expo-google-fonts/sniglet';
import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { QueryClientProvider } from '@tanstack/react-query';
import { Href, Stack, useRouter, useSegments } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import * as SystemUI from 'expo-system-ui';
import { StatusBar } from 'expo-status-bar';
import { useEffect, useLayoutEffect, type ReactNode } from 'react';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import 'react-native-reanimated';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import Toast from 'react-native-toast-message';

import { ApiBootstrap } from '@/src/components/api-bootstrap';
import { useBobbleColors } from '@/src/hooks/use-bobble-colors';
import { useColorScheme } from '@/src/hooks/use-color-scheme';
import { queryClient } from '@/src/services/query-client';
import { useAppStore } from '@/src/store/app-store';
import { BobbleColors, Colors } from '@/src/theme';

SplashScreen.preventAutoHideAsync();

void SystemUI.setBackgroundColorAsync(Colors.light.background);

export const unstable_settings = {
  initialRouteName: 'index',
};

function NavigationThemeProvider({ children }: { children: ReactNode }) {
  const colorScheme = useColorScheme();
  const colors = useBobbleColors();

  const navigationTheme =
    colorScheme === 'dark'
      ? {
          ...DarkTheme,
          colors: {
            ...DarkTheme.colors,
            primary: BobbleColors.primaryLight,
            background: colors.background,
            card: colors.surface,
            text: colors.text,
            border: colors.border,
          },
        }
      : {
          ...DefaultTheme,
          colors: {
            ...DefaultTheme.colors,
            primary: BobbleColors.primary,
            background: colors.background,
            card: colors.surface,
            text: colors.text,
            border: colors.border,
          },
        };

  return (
    <ThemeProvider value={navigationTheme}>
      {children}
      <StatusBar style={colorScheme === 'dark' ? 'light' : 'dark'} />
    </ThemeProvider>
  );
}

function AppShell() {
  const hasHydrated = useAppStore((s) => s.hasHydrated);
  const isAuthenticated = useAppStore((s) => s.isAuthenticated);
  const colors = useBobbleColors();
  const router = useRouter();
  const segments = useSegments();
  const [fontsLoaded] = useFonts({
    Sniglet_400Regular,
    Sniglet_800ExtraBold,
    DynaPuff_400Regular,
  });

  useLayoutEffect(() => {
    if (!hasHydrated) return;
    void SystemUI.setBackgroundColorAsync(colors.background);
  }, [hasHydrated, colors.background]);

  useEffect(() => {
    if (!hasHydrated || !fontsLoaded || !isAuthenticated) return;
    void SplashScreen.hideAsync();
  }, [hasHydrated, fontsLoaded, isAuthenticated]);

  // Store-driven auth guard: the persisted `isAuthenticated` flag is the single
  // source of truth for access. Signed-in users are kept out of the auth flow,
  // and signed-out users are pushed back to it from any protected screen. This
  // reacts automatically to login (`setSession`) and logout (`clearSession`).
  useEffect(() => {
    if (!hasHydrated || !fontsLoaded) return;

    const segmentList = segments as string[];
    const inAuthGroup = segmentList[0] === '(auth)';
    const atRootIndex = segmentList.length === 0;

    if (isAuthenticated && inAuthGroup) {
      router.replace('/(tabs)' as Href);
    } else if (!isAuthenticated && !inAuthGroup && !atRootIndex) {
      router.replace('/(auth)/splash' as Href);
    }
  }, [hasHydrated, fontsLoaded, isAuthenticated, segments, router]);

  if (!hasHydrated || !fontsLoaded) {
    return null;
  }

  return (
    <>
      <ApiBootstrap />
      <NavigationThemeProvider>
        <Stack>
          <Stack.Screen name="index" options={{ headerShown: false }} />
          <Stack.Screen name="(auth)" options={{ headerShown: false }} />
          <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
          <Stack.Screen name="capture" options={{ headerShown: false, animation: 'slide_from_bottom' }} />
          <Stack.Screen name="bobble" options={{ headerShown: false }} />
          <Stack.Screen name="settings" options={{ headerShown: false }} />
          <Stack.Screen name="share" options={{ presentation: 'modal', headerShown: false }} />
          <Stack.Screen name="modal" options={{ presentation: 'modal', title: 'Modal' }} />
        </Stack>
      </NavigationThemeProvider>
    </>
  );
}

export default function RootLayout() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaProvider>
        <QueryClientProvider client={queryClient}>
          <AppShell />
        </QueryClientProvider>
        <Toast />
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}
