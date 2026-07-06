import { API } from '@/src/api/endpoints';
import { BACKEND_ALLOWED } from '@/src/config/backend';
import { api, unwrap } from '@/src/services/api';

export interface HealthData {
  timestamp: string;
  environment: string;
}

export async function fetchHealth(): Promise<HealthData> {
  if (!BACKEND_ALLOWED) {
    return {
      timestamp: new Date().toISOString(),
      environment: 'offline-ui',
    };
  }
  const res = await api.get<HealthData>(API.health, { skipAuth: true });
  return unwrap(res);
}
