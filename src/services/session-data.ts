import { queryClient } from '@/src/services/query-client';
import { resetGuestData } from '@/src/services/offline';
import { clearTaskWidgets } from '@/src/services/widget-sync';
import { useCaptureStore } from '@/src/store/capture-store';

/** Remove data that must never cross an authentication/session boundary. */
export function clearSessionData(): void {
  queryClient.clear();
  useCaptureStore.setState({
    captureKind: 'bobble',
    recordingUri: null,
    recordingDurationSeconds: 0,
    pendingBobbleSave: null,
  });
  void clearTaskWidgets();
}

/** Prepare an empty local data store before guest queries are enabled. */
export function prepareGuestSession(): void {
  clearSessionData();
  resetGuestData();
}
