import { useEffect, useRef, useState } from 'react';

/** Matches the one-shot intro length in scripts/animate-mascot-home.py */
export const HOME_HEART_INTRO_DURATION_MS = 1200;

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

    if (!wasFocusedRef.current) {
      wasFocusedRef.current = true;
      setReplayKey((key) => key + 1);
      setPlayIntro(true);
    }
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
