import { Href, router } from 'expo-router';
import { Settings } from 'lucide-react-native';
import { useEffect, useState } from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { CaptureHeader } from '@/src/components/capture/capture-header';
import { MASCOT_THOUGHT_ANCHOR, ProcessingAtomBadge } from '@/src/components/capture/processing-atom-badge';
import { ProcessingChecklist } from '@/src/components/capture/processing-checklist';
import { RecordingPlaybackBar } from '@/src/components/capture/recording-playback-bar';
import { DEMO_BOBBLE } from '@/src/components/capture/summary-content';
import { SecondaryButton } from '@/src/components/home/secondary-button';
import { BobbleMascot } from '@/src/components/onboarding/bobble-mascot';
import { PrimaryButton } from '@/src/components/onboarding/primary-button';
import { useBobbleColors } from '@/src/hooks/use-bobble-colors';
import { useCaptureStore } from '@/src/store/capture-store';
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
  const isComplete = completedCount >= STEPS.length;
  const recordingUri = useCaptureStore((state) => state.recordingUri);
  const recordingDurationSeconds = useCaptureStore((state) => state.recordingDurationSeconds);
  const clearRecording = useCaptureStore((state) => state.clearRecording);

  useEffect(() => {
    if (isComplete) return;

    const timeout = setTimeout(() => {
      setCompletedCount((prev) => prev + 1);
    }, 900);

    return () => clearTimeout(timeout);
  }, [completedCount, isComplete]);

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

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {recordingUri ? (
          <View style={styles.playbackWrap}>
            <RecordingPlaybackBar uri={recordingUri} durationSeconds={recordingDurationSeconds} />
          </View>
        ) : null}

        {!isComplete ? (
          <>
            <View style={styles.mascotWrap}>
              <View style={styles.mascotContainer}>
                <BobbleMascot variant="main" size={160} />
                <View style={[styles.thinkingBadge, { backgroundColor: colors.background }]}>
                  <ProcessingAtomBadge backgroundColor={colors.background} />
                </View>
              </View>
            </View>

            <ProcessingChecklist steps={STEPS} completedCount={completedCount} />
          </>
        ) : (
          <View style={styles.previewSection}>
            <Text style={[styles.previewIntro, { color: colors.textSecondary }]}>
              {DEMO_BOBBLE.intro}
            </Text>

            <View style={[styles.previewCard, { backgroundColor: colors.borderLight }]}>
              <Text style={[styles.previewTitle, { color: colors.text }]}>{DEMO_BOBBLE.title}</Text>
              <View style={styles.previewList}>
                {DEMO_BOBBLE.bullets.map((item) => (
                  <View key={item.label} style={styles.previewRow}>
                    <Text style={[styles.previewDot, { color: colors.primary }]}>•</Text>
                    <Text style={[styles.previewText, { color: colors.text }]}>
                      <Text style={styles.previewLabel}>{item.label}: </Text>
                      {item.value}
                    </Text>
                  </View>
                ))}
              </View>
            </View>

            <Text style={[styles.previewHint, { color: colors.textSecondary }]}>
              Review this preview before continuing to the full summary.
            </Text>
          </View>
        )}
      </ScrollView>

      {isComplete ? (
        <View style={styles.actions}>
          <PrimaryButton
            label="Continue"
            style={styles.primaryAction}
            onPress={() => router.replace('/capture/summary' as Href)}
          />
          <SecondaryButton
            label="Record Again"
            style={styles.secondaryAction}
            onPress={() => {
              clearRecording();
              router.replace('/capture/record' as Href);
            }}
          />
        </View>
      ) : (
        <Text style={[styles.footer, { color: colors.textSecondary }]}>Almost there...</Text>
      )}
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
  scroll: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    paddingBottom: 16,
  },
  playbackWrap: {
    marginBottom: 20,
  },
  previewSection: {
    gap: 16,
    paddingTop: 8,
  },
  previewIntro: {
    ...Typography.body,
    textAlign: 'center',
  },
  previewCard: {
    borderRadius: 20,
    padding: 20,
    gap: 14,
  },
  previewTitle: {
    ...Typography.formLabel,
    fontSize: 18,
    lineHeight: 26,
  },
  previewList: {
    gap: 10,
  },
  previewRow: {
    flexDirection: 'row',
    gap: 8,
  },
  previewDot: {
    ...Typography.body,
    lineHeight: 24,
  },
  previewText: {
    ...Typography.body,
    flex: 1,
  },
  previewLabel: {
    fontFamily: Typography.button.fontFamily,
  },
  previewHint: {
    ...Typography.caption,
    textAlign: 'center',
    paddingHorizontal: 8,
  },
  actions: {
    gap: 12,
    marginTop: 'auto',
    paddingTop: 12,
  },
  primaryAction: {
    width: '100%',
  },
  secondaryAction: {
    width: '100%',
  },
  footer: {
    ...Typography.body,
    textAlign: 'center',
    marginTop: 'auto',
  },
});
