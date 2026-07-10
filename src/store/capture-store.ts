import { create } from 'zustand';

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
  setCaptureKind: (kind: CaptureKind) => void;
  setRecording: (uri: string, durationSeconds: number) => void;
  clearRecording: () => void;
}

export const useCaptureStore = create<CaptureState>((set) => ({
  captureKind: 'bobble',
  recordingUri: null,
  recordingDurationSeconds: 0,

  setCaptureKind: (kind) => set({ captureKind: kind }),

  setRecording: (uri, durationSeconds) =>
    set({ recordingUri: uri, recordingDurationSeconds: durationSeconds }),

  clearRecording: () => set({ recordingUri: null, recordingDurationSeconds: 0 }),
}));
