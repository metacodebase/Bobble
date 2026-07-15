import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

import { bobblesApi } from '@/src/api';
import type {
  CreateBobbleBody,
  ListBobblesParams,
  UpdateBobbleBody,
  UploadAudioBody,
} from '@/src/features/bobbles/types';
import { queryKeys } from '@/src/services/query-keys';
import { useAppStore } from '@/src/store/app-store';
import { getApiErrorMessage } from '@/src/utils/api-error';
import { toast } from '@/src/utils/toast';

function listKey(params: ListBobblesParams = {}) {
  return queryKeys.bobbles.list(JSON.stringify(params));
}

export function useBobbles(params: ListBobblesParams = {}, enabled = true) {
  const isAuthenticated = useAppStore((s) => s.isAuthenticated);
  return useQuery({
    queryKey: listKey(params),
    queryFn: () => bobblesApi.listBobbles(params),
    enabled: enabled && isAuthenticated,
    staleTime: 30_000,
  });
}

export function useBobble(id: string | undefined, enabled = true) {
  const isAuthenticated = useAppStore((s) => s.isAuthenticated);
  return useQuery({
    queryKey: queryKeys.bobbles.detail(id ?? ''),
    queryFn: () => bobblesApi.getBobble(id!),
    enabled: enabled && isAuthenticated && Boolean(id),
    staleTime: 30_000,
  });
}

export function useCreateBobble() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (body: CreateBobbleBody) => bobblesApi.createBobble(body),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: queryKeys.bobbles.all });
      qc.invalidateQueries({ queryKey: queryKeys.auth.me });
      qc.invalidateQueries({ queryKey: queryKeys.profile.all });
    },
    onError: (e) => toast.error(getApiErrorMessage(e, 'Could not create bobble')),
  });
}

export function useUpdateBobble() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, body }: { id: string; body: UpdateBobbleBody }) =>
      bobblesApi.updateBobble(id, body),
    onSuccess: (bobble) => {
      qc.setQueryData(queryKeys.bobbles.detail(bobble._id), bobble);
      qc.invalidateQueries({ queryKey: queryKeys.bobbles.all });
    },
    onError: (e) => toast.error(getApiErrorMessage(e, 'Could not update bobble')),
  });
}

export function useDeleteBobble() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => bobblesApi.deleteBobble(id),
    onSuccess: (_data, id) => {
      qc.removeQueries({ queryKey: queryKeys.bobbles.detail(id) });
      qc.invalidateQueries({ queryKey: queryKeys.bobbles.all });
    },
    onError: (e) => toast.error(getApiErrorMessage(e, 'Could not delete bobble')),
  });
}

export function useProcessBobble() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => bobblesApi.processBobble(id),
    onSuccess: (bobble) => {
      qc.setQueryData(queryKeys.bobbles.detail(bobble._id), bobble);
      qc.invalidateQueries({ queryKey: queryKeys.bobbles.all });
    },
    onError: (e) => toast.error(getApiErrorMessage(e, 'Could not process bobble')),
  });
}

export function useUploadBobbleAudio() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, body }: { id: string; body: UploadAudioBody }) =>
      bobblesApi.uploadBobbleAudio(id, body),
    onSuccess: (bobble) => {
      qc.setQueryData(queryKeys.bobbles.detail(bobble._id), bobble);
    },
    onError: (e) => toast.error(getApiErrorMessage(e, 'Could not upload audio')),
  });
}
