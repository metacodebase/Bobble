import { API } from '@/src/api/endpoints';
import type {
  Bobble,
  CreateBobbleBody,
  ListBobblesParams,
  UpdateBobbleBody,
  UploadAudioBody,
} from '@/src/features/bobbles/types';
import { api, buildQueryString, unwrap, unwrapPaginated } from '@/src/services/api';
import { offlineBobbles } from '@/src/services/offline';
import { shouldUseOfflineData } from '@/src/services/offline/mode';

/** Must stay in sync with backend `listBobblesQuerySchema` max limit. */
export const BOBBLES_MAX_PAGE_SIZE = 100;

export async function listBobbles(params: ListBobblesParams = {}): Promise<Bobble[]> {
  if (shouldUseOfflineData()) return offlineBobbles.listBobbles(params);
  const qs = buildQueryString({
    category: params.category,
    status: params.status,
    search: params.search,
    page: params.page ?? 1,
    limit: Math.min(params.limit ?? 50, BOBBLES_MAX_PAGE_SIZE),
  });
  const res = await api.getPaginated<Bobble>(`${API.bobbles.root}${qs}`);
  return unwrapPaginated(res).data;
}

export async function listAllBobbles(
  params: Omit<ListBobblesParams, 'page' | 'limit'> = {},
): Promise<Bobble[]> {
  if (shouldUseOfflineData()) return offlineBobbles.listBobbles(params);

  const all: Bobble[] = [];
  let page = 1;
  let hasNextPage = true;

  while (hasNextPage) {
    const qs = buildQueryString({
      category: params.category,
      status: params.status,
      search: params.search,
      page,
      limit: BOBBLES_MAX_PAGE_SIZE,
    });
    const res = await api.getPaginated<Bobble>(`${API.bobbles.root}${qs}`);
    const { data, pagination } = unwrapPaginated(res);
    all.push(...data);
    hasNextPage = pagination.hasNextPage;
    page += 1;
  }

  return all;
}

export async function getBobble(id: string): Promise<Bobble> {
  if (shouldUseOfflineData()) return offlineBobbles.getBobble(id);
  const res = await api.get<Bobble>(API.bobbles.byId(id));
  return unwrap(res);
}

export async function createBobble(body: CreateBobbleBody): Promise<Bobble> {
  if (shouldUseOfflineData()) return offlineBobbles.createBobble(body);
  const res = await api.post<Bobble, CreateBobbleBody>(API.bobbles.root, body);
  return unwrap(res);
}

export async function updateBobble(id: string, body: UpdateBobbleBody): Promise<Bobble> {
  if (shouldUseOfflineData()) return offlineBobbles.updateBobble(id, body);
  const res = await api.patch<Bobble, UpdateBobbleBody>(API.bobbles.byId(id), body);
  return unwrap(res);
}

export async function deleteBobble(id: string): Promise<{ id: string }> {
  if (shouldUseOfflineData()) return offlineBobbles.deleteBobble(id);
  const res = await api.delete<{ id: string }>(API.bobbles.byId(id));
  return unwrap(res);
}

export async function deleteBobblesBulk(ids: string[]): Promise<void> {
  if (shouldUseOfflineData()) {
    await offlineBobbles.deleteBobblesBulk(ids);
    return;
  }
  const results = await Promise.allSettled(ids.map((id) => deleteBobble(id)));
  const failed = results.filter((result) => result.status === 'rejected').length;
  if (failed > 0) {
    throw new Error(`${failed} bobble${failed === 1 ? '' : 's'} could not be deleted`);
  }
}

export async function archiveBobble(id: string): Promise<Bobble> {
  if (shouldUseOfflineData()) return offlineBobbles.archiveBobble(id);
  return updateBobble(id, { archived: true });
}

export async function processBobble(id: string): Promise<Bobble> {
  if (shouldUseOfflineData()) return offlineBobbles.processBobble(id);
  const res = await api.post<Bobble, Record<string, never>>(API.bobbles.process(id), {});
  return unwrap(res);
}

export async function uploadBobbleAudio(id: string, body: UploadAudioBody): Promise<Bobble> {
  if (shouldUseOfflineData()) return offlineBobbles.uploadBobbleAudio(id, body);
  const res = await api.post<Bobble, UploadAudioBody>(API.bobbles.audio(id), body);
  return unwrap(res);
}
