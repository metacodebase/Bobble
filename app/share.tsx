import { router, useLocalSearchParams } from 'expo-router';

import { ShareAchievement } from '@/src/components/share/share-achievement';

export default function ShareScreen() {
  const { cardId } = useLocalSearchParams<{ cardId?: string }>();

  return <ShareAchievement cardId={cardId} onClose={() => router.back()} />;
}
