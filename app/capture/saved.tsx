import { Href, Redirect } from 'expo-router';

import { useCaptureStore } from '@/src/store/capture-store';

export default function SavedScreen() {
  const pendingSave = useCaptureStore((state) => state.pendingBobbleSave);

  if (pendingSave) {
    return <Redirect href={'/capture/saving' as Href} />;
  }

  return <Redirect href={'/(tabs)' as Href} />;
}
