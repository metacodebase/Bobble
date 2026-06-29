import { Href, router } from 'expo-router';
import { Settings } from 'lucide-react-native';
import { useEffect, useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { CaptureHeader } from '@/src/components/capture/capture-header';
import { MASCOT_THOUGHT_ANCHOR, ProcessingAtomBadge } from '@/src/components/capture/processing-atom-badge';
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
        <View style={styles.mascotContainer}>
          <BobbleMascot variant="main" size={160} />
          <View style={[styles.thinkingBadge,{backgroundColor:colors.background}]}>
            <ProcessingAtomBadge backgroundColor={colors.background} />
          </View>
        </View>
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
  mascotContainer: {
    position: 'relative',
    width: 160,
    height: 160,
    alignItems: 'center',
    justifyContent: 'center',
  },
  thinkingBadge: {
    position: 'absolute',
    top: MASCOT_THOUGHT_ANCHOR.top,
    right: MASCOT_THOUGHT_ANCHOR.right,
    zIndex: 100,
  },
  footer: {
    ...Typography.body,
    textAlign: 'center',
    marginTop: 'auto',
  },
});
