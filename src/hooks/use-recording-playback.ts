import { setAudioModeAsync, useAudioPlayer, useAudioPlayerStatus } from 'expo-audio';
import type { AudioSource } from 'expo-audio';
import { useCallback, useEffect, useState } from 'react';

import { useAppStore } from '@/src/store/app-store';
import { resolvePlaybackSource } from '@/src/utils/audio-playback';

type UseRecordingPlaybackOptions = {
  localUri?: string | null;
  remoteAudioUrl?: string | null;
  bobbleId?: string | null;
  durationSeconds?: number;
};

export function useRecordingPlayback({
  localUri,
  remoteAudioUrl,
  bobbleId,
  durationSeconds = 0,
}: UseRecordingPlaybackOptions) {
  const authToken = useAppStore((state) => state.authToken);
  const [playbackSource, setPlaybackSource] = useState<AudioSource | null>(null);
  const [isResolving, setIsResolving] = useState(true);

  useEffect(() => {
    let cancelled = false;
    setIsResolving(true);

    void (async () => {
      const resolved = await resolvePlaybackSource({
        localUri,
        remoteAudioUrl,
        bobbleId,
        authToken,
      });
      if (!cancelled) {
        setPlaybackSource(resolved);
        setIsResolving(false);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [authToken, bobbleId, localUri, remoteAudioUrl]);

  const player = useAudioPlayer(null, {
    updateInterval: 250,
    downloadFirst: Boolean(bobbleId?.trim() && remoteAudioUrl?.trim()),
  });
  const status = useAudioPlayerStatus(player);

  useEffect(() => {
    void setAudioModeAsync({
      playsInSilentMode: true,
      allowsRecording: false,
    });
  }, []);

  useEffect(() => {
    if (!playbackSource) return;
    player.replace(playbackSource);
  }, [playbackSource, player]);

  const totalDuration = status.duration > 0 ? status.duration : durationSeconds;
  const progress = totalDuration > 0 ? Math.min(1, status.currentTime / totalDuration) : 0;
  const canPlay = Boolean(playbackSource) && !isResolving;

  const handleTogglePlayback = useCallback(() => {
    if (!canPlay) return;

    if (status.playing) {
      player.pause();
      return;
    }

    if (status.didJustFinish || (totalDuration > 0 && status.currentTime >= totalDuration)) {
      player.seekTo(0);
    }

    player.play();
  }, [canPlay, player, status, totalDuration]);

  const handleJump = useCallback(
    (seconds: number) => {
      if (!canPlay) return;
      player.seekTo(seconds);
      player.play();
    },
    [canPlay, player],
  );

  return {
    canPlay,
    isResolving,
    status,
    totalDuration,
    progress,
    handleTogglePlayback,
    handleJump,
  };
}
