import { Stack } from 'expo-router';
import { ImageBackground, StyleSheet, View } from 'react-native';

import { useBobbleColors } from '@/src/hooks/use-bobble-colors';
import { useColorScheme } from '@/src/hooks/use-color-scheme';
import { DEFAULT_APP_BACKGROUND, DEFAULT_APP_BACKGROUND_COLOR } from '@/src/theme/backgrounds';

export default function CaptureLayout() {
  const colorScheme = useColorScheme();
  const colors = useBobbleColors();
  const backgroundColor =
    colorScheme === 'dark' ? colors.background : DEFAULT_APP_BACKGROUND_COLOR;

  const stack = (
    <Stack
      screenLayout={({ children }) =>
        colorScheme === 'dark' ? (
          <View style={[styles.root, { backgroundColor }]}>{children}</View>
        ) : (
          <ImageBackground
            source={DEFAULT_APP_BACKGROUND}
            style={[styles.root, { backgroundColor }]}
            resizeMode="cover"
          >
            {children}
          </ImageBackground>
        )
      }
      screenOptions={{
        headerShown: false,
        animation: 'slide_from_right',
        contentStyle: { backgroundColor },
      }}
    >
      <Stack.Screen name="record" />
      <Stack.Screen name="processing" />
      <Stack.Screen name="summary" />
      <Stack.Screen name="saved" options={{ gestureEnabled: false }} />
    </Stack>
  );

  if (colorScheme === 'dark') {
    return <View style={[styles.root, { backgroundColor }]}>{stack}</View>;
  }

  return (
    <ImageBackground
      source={DEFAULT_APP_BACKGROUND}
      style={[styles.root, { backgroundColor }]}
      resizeMode="cover"
    >
      {stack}
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
  },
});
