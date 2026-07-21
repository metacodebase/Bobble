import { Pause, Play } from 'lucide-react-native';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { useBobbleColors } from '@/src/hooks/use-bobble-colors';
import { useRecordingPlayback } from '@/src/hooks/use-recording-playback';
import { Typography } from '@/src/theme/fonts';

const PROCESSING_TEXT = '#17164B';

type RecordingPlaybackBarProps = {
  uri: string;
  durationSeconds?: number;
};

function formatTime(seconds: number) {
  const safeSeconds = Math.max(0, Math.floor(seconds));
  const mins = Math.floor(safeSeconds / 60);
  const secs = safeSeconds % 60;
  return `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
}

export function RecordingPlaybackBar({ uri, durationSeconds = 0 }: RecordingPlaybackBarProps) {
  const colors = useBobbleColors();
  const { canPlay, status, totalDuration, progress, handleTogglePlayback } = useRecordingPlayback({
    localUri: uri,
    durationSeconds,
  });

  return (
    <View style={styles.root}>
      <Pressable
        onPress={handleTogglePlayback}
        disabled={!canPlay}
        style={({ pressed }) => [
          styles.playButton,
          { backgroundColor: colors.primary },
          !canPlay && styles.playButtonDisabled,
          pressed && canPlay && styles.pressed,
        ]}
        accessibilityRole="button"
        accessibilityLabel={status.playing ? 'Pause recording' : 'Play recording'}
      >
        {status.playing ? (
          <Pause size={18} color={colors.textOnPrimary} fill={colors.textOnPrimary} strokeWidth={0} />
        ) : (
          <Play size={18} color={colors.textOnPrimary} fill={colors.textOnPrimary} strokeWidth={0} />
        )}
      </Pressable>

      <View style={styles.trackBlock}>
        <Text style={styles.label}>Your recording</Text>
        <View style={[styles.track, { backgroundColor: `${colors.primary}22` }]}>
          <View
            style={[
              styles.fill,
              {
                backgroundColor: colors.primary,
                width: `${progress * 100}%`,
              },
            ]}
          />
        </View>
        <View style={styles.timeRow}>
          <Text style={[styles.time, { color: colors.primaryMuted }]}>
            {formatTime(status.currentTime)}
          </Text>
          <Text style={[styles.time, { color: colors.primaryMuted }]}>
            {formatTime(totalDuration)}
          </Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
    borderRadius: 20,
    padding: 16,
    backgroundColor: '#FFFFFF',
    shadowColor: '#9F52F2',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 3,
  },
  playButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
  },
  playButtonDisabled: {
    opacity: 0.5,
  },
  pressed: {
    opacity: 0.88,
  },
  trackBlock: {
    flex: 1,
    gap: 8,
  },
  label: {
    ...Typography.caption,
    fontFamily: Typography.button.fontFamily,
    color: PROCESSING_TEXT,
    fontSize: 14,
  },
  track: {
    height: 6,
    borderRadius: 3,
    overflow: 'hidden',
  },
  fill: {
    height: '100%',
    borderRadius: 3,
  },
  timeRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  time: {
    ...Typography.caption,
    fontVariant: ['tabular-nums'],
  },
});
