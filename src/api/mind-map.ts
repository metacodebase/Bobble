import { API } from '@/src/api/endpoints';
import type { MindMapCluster } from '@/src/features/mind-map/types';
import { api, unwrap } from '@/src/services/api';
import { shouldUseOfflineData } from '@/src/services/offline/mode';

export async function listMindMapClusters(): Promise<MindMapCluster[]> {
  if (shouldUseOfflineData()) return [];
  const res = await api.get<MindMapCluster[]>(API.mindMap.root);
  return unwrap(res);
}
