import { API } from '@/src/api/endpoints';
import { BACKEND_ALLOWED } from '@/src/config/backend';
import type {
  Bobble,
  CreateBobbleBody,
  ListBobblesParams,
  UpdateBobbleBody,
  UploadAudioBody,
} from '@/src/features/bobbles/types';
import { api, buildQueryString, unwrap, unwrapPaginated } from '@/src/services/api';
import { offlineBobbles } from '@/src/services/offline';

export async function listBobbles(params: ListBobblesParams = {}): Promise<Bobble[]> {
  if (!BACKEND_ALLOWED) return offlineBobbles.listBobbles(params);
  const qs = buildQueryString({
    category: params.category,
    status: params.status,
    search: params.search,
    page: params.page ?? 1,
    limit: params.limit ?? 50,
  });
  const res = await api.getPaginated<Bobble>(`${API.bobbles.root}${qs}`);
  return unwrapPaginated(res).data;
}

export async function getBobble(id: string): Promise<Bobble> {
  if (!BACKEND_ALLOWED) return offlineBobbles.getBobble(id);
  const res = await api.get<Bobble>(API.bobbles.byId(id));
  return unwrap(res);
}

export async function createBobble(body: CreateBobbleBody): Promise<Bobble> {
  if (!BACKEND_ALLOWED) return offlineBobbles.createBobble(body);
  const res = await api.post<Bobble, CreateBobbleBody>(API.bobbles.root, body);
  return unwrap(res);
}

export async function updateBobble(id: string, body: UpdateBobbleBody): Promise<Bobble> {
  if (!BACKEND_ALLOWED) return offlineBobbles.updateBobble(id, body);
  const res = await api.patch<Bobble, UpdateBobbleBody>(API.bobbles.byId(id), body);
  return unwrap(res);
}

export async function deleteBobble(id: string): Promise<{ id: string }> {
  if (!BACKEND_ALLOWED) return offlineBobbles.deleteBobble(id);
  const res = await api.delete<{ id: string }>(API.bobbles.byId(id));
  return unwrap(res);
}

export async function processBobble(id: string): Promise<Bobble> {
  if (!BACKEND_ALLOWED) return offlineBobbles.processBobble(id);
  const res = await api.post<Bobble, Record<string, never>>(API.bobbles.process(id), {});
  return unwrap(res);
}

export async function uploadBobbleAudio(id: string, body: UploadAudioBody): Promise<Bobble> {
  if (!BACKEND_ALLOWED) return offlineBobbles.uploadBobbleAudio(id, body);
  const res = await api.post<Bobble, UploadAudioBody>(API.bobbles.audio(id), body);
  return unwrap(res);
}
