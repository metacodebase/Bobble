import { create } from 'zustand';

import type { BobbleCategory } from '@/src/features/bobbles/types';

export type CaptureKind = 'bobble' | 'idea' | 'task' | 'brain-dump' | 'reflection';

export const CAPTURE_COPY: Record<
  CaptureKind,
  { title: string; listening: string }
> = {
  bobble: { title: 'New Bobble', listening: 'Listening...' },
  idea: { title: 'New Idea', listening: 'Listening to your idea' },
  task: { title: 'New Task', listening: 'Listening to your task' },
  'brain-dump': { title: 'New Brain Dump', listening: 'Listening to your brain dump' },
  reflection: { title: 'New Reflection', listening: 'Listening to your reflection' },
};

interface CaptureState {
  captureKind: CaptureKind;
  recordingUri: string | null;
  recordingDurationSeconds: number;
  pendingBobbleSave: {
    title: string;
    dateLabel: string;
    durationMin: number;
    durationSec: number;
    category: BobbleCategory;
    tasks: { title: string }[];
    /** Set after the API create succeeds so the success screen can navigate to the real id. */
    createdBobbleId?: string;
  } | null;
  setCaptureKind: (kind: CaptureKind) => void;
  setRecording: (uri: string, durationSeconds: number) => void;
  clearRecording: () => void;
  setPendingBobbleSave: (save: CaptureState['pendingBobbleSave']) => void;
  clearPendingBobbleSave: () => void;
}

export const useCaptureStore = create<CaptureState>((set) => ({
  captureKind: 'bobble',
  recordingUri: null,
  recordingDurationSeconds: 0,
  pendingBobbleSave: null,

  setCaptureKind: (kind) => set({ captureKind: kind }),

  setRecording: (uri, durationSeconds) =>
    set({ recordingUri: uri, recordingDurationSeconds: durationSeconds }),

  clearRecording: () => set({ recordingUri: null, recordingDurationSeconds: 0 }),

  setPendingBobbleSave: (save) => set({ pendingBobbleSave: save }),

  clearPendingBobbleSave: () => set({ pendingBobbleSave: null }),
}));
