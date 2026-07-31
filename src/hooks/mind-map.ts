import { useQuery, useQueryClient } from '@tanstack/react-query';

import { mindMapApi } from '@/src/api';
import { queryKeys } from '@/src/services/query-keys';
import { useAppStore } from '@/src/store/app-store';
import { useIsPro } from '@/src/hooks/use-subscription';

export function useMindMapClusters(enabled = true) {
  const isAuthenticated = useAppStore((s) => s.isAuthenticated);
  const isPro = useIsPro();

  return useQuery({
    queryKey: queryKeys.mindMap.list,
    queryFn: () => mindMapApi.listMindMapClusters(),
    enabled: enabled && isAuthenticated && isPro,
    staleTime: 30_000,
  });
}

export function useInvalidateMindMap() {
  const qc = useQueryClient();
  return () => {
    void qc.invalidateQueries({ queryKey: queryKeys.mindMap.all });
  };
}
