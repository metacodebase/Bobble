import { API } from '@/src/api/endpoints';
import { api, unwrap } from '@/src/services/api';

export interface HealthData {
  timestamp: string;
  environment: string;
}

export async function fetchHealth(): Promise<HealthData> {
  const res = await api.get<HealthData>(API.health, { skipAuth: true });
  return unwrap(res);
}
