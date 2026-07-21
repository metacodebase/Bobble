import { router, useLocalSearchParams } from 'expo-router';

import { ShareAchievement } from '@/src/components/share/share-achievement';

export default function ShareScreen() {
  const { cardId, bobbleId } = useLocalSearchParams<{ cardId?: string; bobbleId?: string }>();

  return (
    <ShareAchievement cardId={cardId} bobbleId={bobbleId} onClose={() => router.back()} />
  );
}
