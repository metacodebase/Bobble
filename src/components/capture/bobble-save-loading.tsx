import { Image } from 'expo-image';
import { StyleSheet, Text, View } from 'react-native';

import { useBobbleColors } from '@/src/hooks/use-bobble-colors';
import { useNightForeground } from '@/src/hooks/use-night-foreground';
import { Typography } from '@/src/theme/fonts';

const SAVING_MASCOT = require('@/src/assets/images/bobble-saving.png');
const MIN_PROGRESS = 0.08;

type BobbleSaveLoadingProps = {
  progress: number;
  /** Current pipeline step shown under the title. */
  stageLabel?: string;
};

export function BobbleSaveLoading({
  progress,
  stageLabel = 'Organising your thoughts…',
}: BobbleSaveLoadingProps) {
  const colors = useBobbleColors();
  const night = useNightForeground();
  const textColor = night.text ?? colors.text;
  const secondaryColor = night.textSecondary ?? colors.textSecondary;
  const clampedProgress = Math.max(MIN_PROGRESS, Math.min(progress, 1));

  return (
    <View style={styles.root}>
      <View style={styles.hero}>
        <Text style={[styles.title, { color: textColor }]}>Saving your Bobble…</Text>
        <Text style={[styles.subtitle, { color: secondaryColor }]}>{stageLabel}</Text>
      </View>

      <View style={styles.visual}>
        <Image source={SAVING_MASCOT} style={styles.mascot} contentFit="contain" />
      </View>

      <View style={styles.footer}>
        <Text style={[styles.footerText, { color: textColor }]}>
          {clampedProgress >= 0.9 ? 'Almost done…' : 'This can take up to a minute'}
        </Text>
      </View>
      <View style={styles.track}>
        <View style={[styles.fill, { width: `${clampedProgress * 100}%` }]} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    justifyContent: 'space-evenly',
    paddingTop: 24,
    paddingBottom: 8,
    gap: 20,
  },
  hero: {
    alignItems: 'center',
    gap: 8,
    paddingHorizontal: 12,
  },
  title: {
    ...Typography.heading,
    fontSize: 28,
    lineHeight: 36,
    textAlign: 'center',
  },
  subtitle: {
    ...Typography.body,
    fontSize: 16,
    lineHeight: 24,
    textAlign: 'center',
  },
  visual: {
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 380,
  },
  mascot: {
    width: 380,
    height: 262,
    backgroundColor: 'transparent',
  },
  footer: {
    gap: 12,
    paddingHorizontal: 8,
  },
  footerText: {
    ...Typography.body,
    lineHeight: 22,
    textAlign: 'center',
  },
  track: {
    height: 8,
    borderRadius: 4,
    overflow: 'hidden',
    width: '95%',
    alignSelf: 'center',
    backgroundColor: 'rgba(159, 82, 242, 0.18)',
  },
  fill: {
    height: '100%',
    borderRadius: 4,
    backgroundColor: '#9F52F2',
  },
});
