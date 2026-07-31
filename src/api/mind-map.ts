import { API } from '@/src/api/endpoints';
import { BACKEND_ALLOWED } from '@/src/config/backend';
import type { MindMapCluster } from '@/src/features/mind-map/types';
import { api, unwrap } from '@/src/services/api';

export async function listMindMapClusters(): Promise<MindMapCluster[]> {
  if (!BACKEND_ALLOWED) return [];
  const res = await api.get<MindMapCluster[]>(API.mindMap.root);
  return unwrap(res);
}
