import { setAudioModeAsync, useAudioPlayer, useAudioPlayerStatus } from 'expo-audio';
import { Pause, Play } from 'lucide-react-native';
import { useEffect } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { useBobbleColors } from '@/src/hooks/use-bobble-colors';
import { Typography } from '@/src/theme/fonts';

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
  const player = useAudioPlayer(uri, { updateInterval: 250 });
  const status = useAudioPlayerStatus(player);

  useEffect(() => {
    void setAudioModeAsync({
      playsInSilentMode: true,
      allowsRecording: false,
    });
  }, []);

  const totalDuration = status.duration > 0 ? status.duration : durationSeconds;
  const progress = totalDuration > 0 ? Math.min(1, status.currentTime / totalDuration) : 0;

  const handleTogglePlayback = () => {
    if (status.playing) {
      player.pause();
      return;
    }

    if (status.didJustFinish || (totalDuration > 0 && status.currentTime >= totalDuration)) {
      player.seekTo(0);
    }

    player.play();
  };

  return (
    <View style={[styles.root, { backgroundColor: colors.borderLight }]}>
      <Pressable
        onPress={handleTogglePlayback}
        style={({ pressed }) => [
          styles.playButton,
          { backgroundColor: colors.primary },
          pressed && styles.pressed,
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
        <Text style={[styles.label, { color: colors.text }]}>Your recording</Text>
        <View style={[styles.track, { backgroundColor: colors.surface }]}>
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
          <Text style={[styles.time, { color: colors.textSecondary }]}>
            {formatTime(status.currentTime)}
          </Text>
          <Text style={[styles.time, { color: colors.textSecondary }]}>
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
    padding: 14,
  },
  playButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
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
