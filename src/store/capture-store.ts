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

export type PendingBobbleSave = {
  title: string;
  dateLabel: string;
  durationMin: number;
  durationSec: number;
  category: BobbleCategory;
  tasks: { title: string }[];
  /** Set after create/process succeeds so later screens can navigate / create tasks. */
  createdBobbleId?: string;
  /** AI-suggested task titles from OpenAI enrichment (not yet persisted as Task docs). */
  suggestedTasks?: string[];
  /** Optional summary intro from enrichment for the suggestions screen. */
  summaryIntro?: string;
  /** Whether the user already ran Generate Tasks on the suggestions screen. */
  tasksGenerated?: boolean;
};

interface CaptureState {
  captureKind: CaptureKind;
  recordingUri: string | null;
  recordingDurationSeconds: number;
  pendingBobbleSave: PendingBobbleSave | null;
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
