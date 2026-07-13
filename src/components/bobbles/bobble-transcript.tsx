import { setAudioModeAsync, useAudioPlayer, useAudioPlayerStatus } from 'expo-audio';
import { Pause, Play, Search } from 'lucide-react-native';
import { useEffect, useMemo, useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';

import type { TranscriptSegment } from '@/src/data/demo-data';
import { DEMO_TRANSCRIPT_SEGMENTS } from '@/src/data/demo-data';
import { Typography } from '@/src/theme/fonts';

const TRANSCRIPT_TEXT = '#17164B';

type BobbleTranscriptProps = {
  segments?: TranscriptSegment[];
  recordingUri?: string | null;
  durationSeconds?: number;
};

function formatTime(seconds: number) {
  const safeSeconds = Math.max(0, Math.floor(seconds));
  const mins = Math.floor(safeSeconds / 60);
  const secs = safeSeconds % 60;
  return `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
}

type TranscriptCardProps = {
  segment: TranscriptSegment;
  onJump: (seconds: number) => void;
  canJump: boolean;
};

function TranscriptCard({ segment, onJump, canJump }: TranscriptCardProps) {
  return (
    <View style={styles.card}>
      <View style={styles.cardBody}>
        <Text style={styles.timestamp}>{segment.timestampLabel}</Text>
        <Text style={styles.cardText}>{segment.text}</Text>
      </View>

      <Pressable
        onPress={() => onJump(segment.timestampSeconds)}
        disabled={!canJump}
        style={({ pressed }) => [styles.jumpButton, pressed && canJump && styles.pressed]}
        accessibilityRole="button"
        accessibilityLabel={`Jump to ${segment.timestampLabel}`}
      >
        <View style={styles.jumpIconCircle}>
          <Play size={14} color="#9F52F2" fill="#9F52F2" strokeWidth={0} />
        </View>
        <Text style={styles.jumpLabel}>Jump</Text>
      </Pressable>
    </View>
  );
}

export function BobbleTranscript({
  segments = DEMO_TRANSCRIPT_SEGMENTS,
  recordingUri = null,
  durationSeconds = 34,
}: BobbleTranscriptProps) {
  const [query, setQuery] = useState('');
  const player = useAudioPlayer(recordingUri ?? '', { updateInterval: 250 });
  const status = useAudioPlayerStatus(player);
  const canPlay = Boolean(recordingUri);

  useEffect(() => {
    void setAudioModeAsync({
      playsInSilentMode: true,
      allowsRecording: false,
    });
  }, []);

  const totalDuration = status.duration > 0 ? status.duration : durationSeconds;
  const progress = totalDuration > 0 ? Math.min(1, status.currentTime / totalDuration) : 0;

  const filteredSegments = useMemo(() => {
    const normalized = query.trim().toLowerCase();
    if (!normalized) return segments;
    return segments.filter((segment) => segment.text.toLowerCase().includes(normalized));
  }, [query, segments]);

  const handleJump = (seconds: number) => {
    if (!canPlay) return;
    player.seekTo(seconds);
    player.play();
  };

  const handleTogglePlayback = () => {
    if (!canPlay) return;

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
    <View style={styles.root}>
      <View style={styles.searchWrap}>
        <Search size={18} color="#9CA3AF" strokeWidth={2} />
        <TextInput
          value={query}
          onChangeText={setQuery}
          placeholder="Search transcript"
          placeholderTextColor="#9CA3AF"
          style={styles.searchInput}
          autoCapitalize="none"
          autoCorrect={false}
          clearButtonMode="while-editing"
        />
      </View>

      <ScrollView
        style={styles.list}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        {filteredSegments.map((segment) => (
          <TranscriptCard
            key={segment.id}
            segment={segment}
            onJump={handleJump}
            canJump={canPlay}
          />
        ))}
      </ScrollView>

      <View style={styles.playbackBar}>
        <Pressable
          onPress={handleTogglePlayback}
          disabled={!canPlay}
          style={({ pressed }) => [
            styles.playButton,
            !canPlay && styles.playButtonDisabled,
            pressed && canPlay && styles.pressed,
          ]}
          accessibilityRole="button"
          accessibilityLabel={status.playing ? 'Pause recording' : 'Play recording'}
        >
          {status.playing ? (
            <Pause size={18} color="#FFFFFF" fill="#FFFFFF" strokeWidth={0} />
          ) : (
            <Play size={18} color="#FFFFFF" fill="#FFFFFF" strokeWidth={0} />
          )}
        </Pressable>

        <View style={styles.trackBlock}>
          <Text style={styles.playbackLabel}>Your recording</Text>
          <View style={styles.track}>
            <View style={[styles.trackFill, { width: `${progress * 100}%` }]} />
          </View>
          <View style={styles.timeRow}>
            <Text style={styles.time}>{formatTime(status.currentTime)}</Text>
            <Text style={styles.time}>{formatTime(totalDuration)}</Text>
          </View>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    gap: 14,
  },
  searchWrap: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    backgroundColor: 'rgba(255, 255, 255, 0.72)',
    borderRadius: 24,
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  searchInput: {
    ...Typography.body,
    flex: 1,
    fontSize: 15,
    lineHeight: 20,
    color: TRANSCRIPT_TEXT,
    padding: 0,
  },
  list: {
    flex: 1,
  },
  listContent: {
    gap: 12,
    paddingBottom: 8,
  },
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    paddingVertical: 16,
    paddingHorizontal: 16,
    shadowColor: '#9F52F2',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 2,
  },
  cardBody: {
    flex: 1,
    gap: 8,
  },
  timestamp: {
    ...Typography.caption,
    fontSize: 13,
    lineHeight: 16,
    color: '#6B7280',
  },
  cardText: {
    ...Typography.body,
    fontSize: 15,
    lineHeight: 22,
    color: TRANSCRIPT_TEXT,
  },
  jumpButton: {
    alignItems: 'center',
    gap: 4,
    minWidth: 52,
  },
  jumpIconCircle: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(159, 82, 242, 0.14)',
  },
  jumpLabel: {
    ...Typography.caption,
    fontSize: 12,
    lineHeight: 14,
    color: '#9F52F2',
    fontFamily: Typography.button.fontFamily,
  },
  playbackBar: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
    borderRadius: 20,
    padding: 16,
    backgroundColor: 'rgba(159, 82, 242, 0.14)',
  },
  playButton: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#9F52F2',
  },
  playButtonDisabled: {
    opacity: 0.5,
  },
  trackBlock: {
    flex: 1,
    gap: 8,
  },
  playbackLabel: {
    ...Typography.caption,
    fontFamily: Typography.button.fontFamily,
    color: TRANSCRIPT_TEXT,
    fontSize: 14,
  },
  track: {
    height: 6,
    borderRadius: 3,
    overflow: 'hidden',
    backgroundColor: 'rgba(159, 82, 242, 0.22)',
  },
  trackFill: {
    height: '100%',
    borderRadius: 3,
    backgroundColor: '#9F52F2',
  },
  timeRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  time: {
    ...Typography.caption,
    fontSize: 12,
    color: TRANSCRIPT_TEXT,
    fontVariant: ['tabular-nums'],
  },
  pressed: {
    opacity: 0.75,
  },
});
