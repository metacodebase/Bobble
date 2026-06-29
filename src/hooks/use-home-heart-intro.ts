import AsyncStorage from '@react-native-async-storage/async-storage';
import { useEffect, useState } from 'react';

const STORAGE_KEY = 'bobble.home-heart-intro-seen';

/** Matches the one-shot intro length in scripts/animate-mascot-home.py */
export const HOME_HEART_INTRO_DURATION_MS = 1200;

export function useHomeHeartIntro() {
  const [playIntro, setPlayIntro] = useState<boolean | null>(null);

  useEffect(() => {
    let cancelled = false;

    AsyncStorage.getItem(STORAGE_KEY).then((value) => {
      if (!cancelled) {
        setPlayIntro(value !== '1');
      }
    });

    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    if (playIntro !== true) {
      return;
    }

    const timer = setTimeout(() => {
      void AsyncStorage.setItem(STORAGE_KEY, '1');
      setPlayIntro(false);
    }, HOME_HEART_INTRO_DURATION_MS);

    return () => clearTimeout(timer);
  }, [playIntro]);

  return {
    isLoading: playIntro === null,
    playIntro: playIntro === true,
  };
}
