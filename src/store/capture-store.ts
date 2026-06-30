import { create } from 'zustand';

interface CaptureState {
  recordingUri: string | null;
  recordingDurationSeconds: number;
  setRecording: (uri: string, durationSeconds: number) => void;
  clearRecording: () => void;
}

export const useCaptureStore = create<CaptureState>((set) => ({
  recordingUri: null,
  recordingDurationSeconds: 0,

  setRecording: (uri, durationSeconds) =>
    set({ recordingUri: uri, recordingDurationSeconds: durationSeconds }),

  clearRecording: () => set({ recordingUri: null, recordingDurationSeconds: 0 }),
}));
