import { useEffect, useRef, useState } from 'react';

/** Slightly before the WebP loops back to frame 0 (72 frames @ 60fps = 1200ms). */
export const HOME_HEART_INTRO_DURATION_MS = 1180;

let hasPlayedHomeHeartIntro = false;

export function useHomeHeartIntro(isFocused: boolean) {
  const [playIntro, setPlayIntro] = useState(false);
  const [replayKey, setReplayKey] = useState(0);
  const wasFocusedRef = useRef(false);

  useEffect(() => {
    if (!isFocused) {
      wasFocusedRef.current = false;
      setPlayIntro(false);
      return;
    }

    if (wasFocusedRef.current) {
      return;
    }

    wasFocusedRef.current = true;

    if (hasPlayedHomeHeartIntro) {
      return;
    }

    hasPlayedHomeHeartIntro = true;
    setReplayKey((key) => key + 1);
    setPlayIntro(true);
  }, [isFocused]);

  useEffect(() => {
    if (!playIntro) {
      return;
    }

    const timer = setTimeout(() => {
      setPlayIntro(false);
    }, HOME_HEART_INTRO_DURATION_MS);

    return () => clearTimeout(timer);
  }, [playIntro, replayKey]);

  return {
    playIntro,
    replayKey,
  };
}
