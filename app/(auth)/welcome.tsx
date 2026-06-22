import { Image } from 'expo-image';
import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import { StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { useThemeColor } from '@/src/hooks/use-theme-color';
import { useAppStore } from '@/src/store/app-store';
import { Palette } from '@/src/theme';
import { Pressable } from 'react-native';

export default function WelcomeScreen() {
  const insets = useSafeAreaInsets();
  const background = useThemeColor({}, 'background');
  const text = useThemeColor({}, 'text');
  const textSecondary = useThemeColor({}, 'textSecondary');
  const primary = useThemeColor({}, 'primary');
  const setHasOnboarded = useAppStore((s) => s.setHasOnboarded);

  const handleGetStarted = () => {
    setHasOnboarded(true);
    router.replace('/(tabs)');
  };

  return (
    <LinearGradient
      colors={[Palette.navy, Palette.cobalt, Palette.navy]}
      start={{ x: 0.2, y: 0 }}
      end={{ x: 0.8, y: 1 }}
      style={styles.root}
    >
      <View style={[styles.header, { paddingTop: insets.top + 48 }]}>
        <Image
          source={require('@/src/assets/images/icon.png')}
          style={styles.logo}
          contentFit="contain"
        />
        <Text style={styles.brand}>Bobble</Text>
      </View>

      <View style={[styles.panel, { backgroundColor: background, paddingBottom: insets.bottom + 24 }]}>
        <View style={styles.copy}>
          <Text style={[styles.headline, { color: text }]}>Welcome to Bobble</Text>
          <Text style={[styles.subtitle, { color: textSecondary }]}>
            Your React Native app, ready to build on.
          </Text>
        </View>

        <Pressable
          onPress={handleGetStarted}
          style={({ pressed }) => [
            styles.button,
            { backgroundColor: primary, opacity: pressed ? 0.9 : 1 },
          ]}
        >
          <Text style={styles.buttonText}>Get Started</Text>
        </Pressable>
      </View>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1 },
  header: { flex: 1, alignItems: 'center', justifyContent: 'center', gap: 16 },
  logo: { width: 96, height: 96, borderRadius: 24 },
  brand: { color: '#fff', fontSize: 32, fontWeight: '700', letterSpacing: 1 },
  panel: {
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    paddingHorizontal: 24,
    paddingTop: 32,
    gap: 24,
  },
  copy: { gap: 8 },
  headline: { fontSize: 28, fontWeight: '700' },
  subtitle: { fontSize: 16, lineHeight: 24 },
  button: {
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: 'center',
  },
  buttonText: { color: '#fff', fontSize: 16, fontWeight: '600' },
});
