import { API } from '@/src/api/endpoints';
import { api, unwrap } from '@/src/services/api';

export type NotionStatus = {
  configured: boolean;
  connected: boolean;
  workspaceName?: string;
  dataSourceId?: string;
  dataSourceName?: string;
};

export type NotionDataSource = { id: string; name: string };

export async function getNotionStatus() {
  return unwrap(await api.get<NotionStatus>(API.integrations.notion.status));
}

export async function getNotionAuthorizationUrl() {
  return unwrap(await api.get<{ url: string }>(API.integrations.notion.authorize));
}

export async function listNotionDataSources() {
  return unwrap(await api.get<NotionDataSource[]>(API.integrations.notion.dataSources));
}

export async function selectNotionDataSource(dataSourceId: string) {
  return unwrap(
    await api.post<NotionStatus, { dataSourceId: string }>(API.integrations.notion.dataSource, {
      dataSourceId,
    })
  );
}

export async function resyncNotionTasks() {
  return unwrap(
    await api.post<{ total: number; synced: number; failed: number }, Record<string, never>>(
      API.integrations.notion.resync,
      {}
    )
  );
}

export async function disconnectNotion() {
  return unwrap(await api.delete<{ connected: false }>(API.integrations.notion.root));
}
