import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { Href, router } from 'expo-router';

import { bobblesApi } from '@/src/api';
import type {
  Bobble,
  CreateBobbleBody,
  ListBobblesParams,
  UpdateBobbleBody,
  UploadAudioBody,
} from '@/src/features/bobbles/types';
import { queryKeys } from '@/src/services/query-keys';
import { useAppStore } from '@/src/store/app-store';
import { getApiErrorMessage, isProLimitError } from '@/src/utils/api-error';
import { toast } from '@/src/utils/toast';

type BobblesSnapshot = [readonly unknown[], Bobble[] | undefined][];

function listKey(params: ListBobblesParams = {}) {
  return queryKeys.bobbles.list(JSON.stringify(params));
}

function handleBobbleLimitError(error: unknown, fallback: string) {
  if (isProLimitError(error)) {
    toast.error(getApiErrorMessage(error, fallback));
    router.push('/paywall' as Href);
    return;
  }
  toast.error(getApiErrorMessage(error, fallback));
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
    onError: (e) => handleBobbleLimitError(e, 'Could not create bobble'),
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
    onMutate: async (id: string) => {
      await qc.cancelQueries({ queryKey: queryKeys.bobbles.all });
      const snapshot = qc.getQueriesData<Bobble[]>({ queryKey: ['bobbles', 'list'] });
      qc.setQueriesData<Bobble[]>({ queryKey: ['bobbles', 'list'] }, (prev) =>
        prev?.filter((bobble) => bobble._id !== id),
      );
      qc.removeQueries({ queryKey: queryKeys.bobbles.detail(id) });
      return { snapshot } as { snapshot: BobblesSnapshot };
    },
    onError: (e, _id, context) => {
      context?.snapshot.forEach(([key, data]) => qc.setQueryData(key, data));
      toast.error(getApiErrorMessage(e, 'Could not delete bobble'));
    },
    onSettled: () => {
      qc.invalidateQueries({ queryKey: queryKeys.bobbles.all });
      qc.invalidateQueries({ queryKey: queryKeys.auth.me });
      qc.invalidateQueries({ queryKey: queryKeys.profile.all });
    },
  });
}

export function useDeleteBobblesBulk() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (ids: string[]) => bobblesApi.deleteBobblesBulk(ids),
    onMutate: async (ids: string[]) => {
      await qc.cancelQueries({ queryKey: queryKeys.bobbles.all });
      const snapshot = qc.getQueriesData<Bobble[]>({ queryKey: ['bobbles', 'list'] });
      const idSet = new Set(ids);
      qc.setQueriesData<Bobble[]>({ queryKey: ['bobbles', 'list'] }, (prev) =>
        prev?.filter((bobble) => !idSet.has(bobble._id)),
      );
      ids.forEach((id) => qc.removeQueries({ queryKey: queryKeys.bobbles.detail(id) }));
      return { snapshot } as { snapshot: BobblesSnapshot };
    },
    onError: (e, _ids, context) => {
      context?.snapshot.forEach(([key, data]) => qc.setQueryData(key, data));
      toast.error(getApiErrorMessage(e, 'Could not delete bobbles'));
    },
    onSettled: () => {
      qc.invalidateQueries({ queryKey: queryKeys.bobbles.all });
      qc.invalidateQueries({ queryKey: queryKeys.auth.me });
      qc.invalidateQueries({ queryKey: queryKeys.profile.all });
    },
  });
}

export function useArchiveBobble() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => bobblesApi.archiveBobble(id),
    onMutate: async (id: string) => {
      await qc.cancelQueries({ queryKey: queryKeys.bobbles.all });
      const snapshot = qc.getQueriesData<Bobble[]>({ queryKey: ['bobbles', 'list'] });
      qc.setQueriesData<Bobble[]>({ queryKey: ['bobbles', 'list'] }, (prev) =>
        prev?.filter((bobble) => bobble._id !== id),
      );
      return { snapshot } as { snapshot: BobblesSnapshot };
    },
    onError: (e, _id, context) => {
      context?.snapshot.forEach(([key, data]) => qc.setQueryData(key, data));
      toast.error(getApiErrorMessage(e, 'Could not archive bobble'));
    },
    onSettled: () => {
      qc.invalidateQueries({ queryKey: queryKeys.bobbles.all });
    },
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
