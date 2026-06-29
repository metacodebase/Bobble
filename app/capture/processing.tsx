import { Href, router } from 'expo-router';
import { useEffect, useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import Animated, {
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withTiming,
} from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Settings } from 'lucide-react-native';

import { CaptureHeader } from '@/src/components/capture/capture-header';
import { ProcessingChecklist } from '@/src/components/capture/processing-checklist';
import { BobbleMascot } from '@/src/components/onboarding/bobble-mascot';
import { useBobbleColors } from '@/src/hooks/use-bobble-colors';
import { Typography } from '@/src/theme/fonts';

const STEPS = [
  { id: 'transcribe', label: 'Transcribing your voice' },
  { id: 'context', label: 'Understanding context' },
  { id: 'extract', label: 'Extracting key points' },
  { id: 'organize', label: 'Organizing ideas' },
] as const;

export default function ProcessingScreen() {
  const colors = useBobbleColors();
  const insets = useSafeAreaInsets();
  const [completedCount, setCompletedCount] = useState(0);
  const rotation = useSharedValue(0);

  useEffect(() => {
    rotation.value = withRepeat(
      withTiming(360, { duration: 3000, easing: Easing.linear }),
      -1,
      false,
    );
  }, [rotation]);

  useEffect(() => {
    if (completedCount >= STEPS.length) {
      const timeout = setTimeout(() => {
        router.replace('/capture/summary' as Href);
      }, 800);
      return () => clearTimeout(timeout);
    }

    const timeout = setTimeout(() => {
      setCompletedCount((prev) => prev + 1);
    }, 900);

    return () => clearTimeout(timeout);
  }, [completedCount]);

  const mascotStyle = useAnimatedStyle(() => ({
    transform: [{ rotate: `${rotation.value}deg` }],
  }));

  return (
    <View
      style={[
        styles.root,
        {
          paddingTop: insets.top + 8,
          paddingBottom: insets.bottom + 24,
          backgroundColor: colors.background,
        },
      ]}
    >
      <CaptureHeader rightIcon={Settings} />

      <Text style={[styles.title, { color: colors.text }]}>Processing with AI</Text>

      <View style={styles.mascotWrap}>
        <Animated.View style={mascotStyle}>
          <BobbleMascot variant="main" size={160} />
        </Animated.View>
      </View>

      <ProcessingChecklist steps={STEPS} completedCount={completedCount} />

      <Text style={[styles.footer, { color: colors.textSecondary }]}>Almost there...</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    paddingHorizontal: 28,
  },
  title: {
    ...Typography.heading,
    fontSize: 24,
    lineHeight: 32,
    textAlign: 'center',
    marginTop: 8,
    marginBottom: 24,
  },
  mascotWrap: {
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 36,
  },
  footer: {
    ...Typography.body,
    textAlign: 'center',
    marginTop: 'auto',
  },
});
