import {
  Poppins_400Regular,
  Poppins_500Medium,
  Poppins_600SemiBold,
  Poppins_700Bold,
  useFonts,
} from '@expo-google-fonts/poppins';
import { Stack } from 'expo-router';
import { ActivityIndicator, View } from 'react-native';

import { BobbleColors } from '@/src/theme/colors';

export default function AuthLayout() {
  const [fontsLoaded] = useFonts({
    Poppins_400Regular,
    Poppins_500Medium,
    Poppins_600SemiBold,
    Poppins_700Bold,
  });

  if (!fontsLoaded) {
    return (
      <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: BobbleColors.background }}>
        <ActivityIndicator color={BobbleColors.primary} />
      </View>
    );
  }

  return (
    <Stack
      initialRouteName="splash"
      screenOptions={{ headerShown: false, animation: 'slide_from_right' }}
    >
      <Stack.Screen name="splash" />
      <Stack.Screen name="onboarding" />
      <Stack.Screen name="sign-in" />
      <Stack.Screen name="create-account" />
    </Stack>
  );
}
