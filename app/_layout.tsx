import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { QueryClientProvider } from '@tanstack/react-query';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import 'react-native-reanimated';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import Toast from 'react-native-toast-message';

import { ApiBootstrap } from '@/src/components/api-bootstrap';
import { useColorScheme } from '@/src/hooks/use-color-scheme';
import { queryClient } from '@/src/services/query-client';

export const unstable_settings = {
  initialRouteName: 'index',
};

export default function RootLayout() {
  const colorScheme = useColorScheme();

  return (
    <SafeAreaProvider>
      <QueryClientProvider client={queryClient}>
        <ApiBootstrap />
        <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
          <Stack>
            <Stack.Screen name="index" options={{ headerShown: false }} />
            <Stack.Screen name="(auth)" options={{ headerShown: false }} />
            <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
            <Stack.Screen name="capture" options={{ headerShown: false, animation: 'slide_from_bottom' }} />
            <Stack.Screen name="bobble" options={{ headerShown: false }} />
            <Stack.Screen name="share" options={{ presentation: 'modal', headerShown: false }} />
            <Stack.Screen name="modal" options={{ presentation: 'modal', title: 'Modal' }} />
          </Stack>
          <StatusBar style="auto" />
        </ThemeProvider>
      </QueryClientProvider>
      <Toast />
    </SafeAreaProvider>
  );
}
