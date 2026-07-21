import { Href, router } from 'expo-router';
import { useCallback } from 'react';
import { Alert } from 'react-native';

import type { Bobble } from '@/src/features/bobbles/types';
import { useBobble, useUpdateBobble } from '@/src/hooks/bobbles';
import { useCreateTasksBulk } from '@/src/hooks/tasks';
import { buildTasksBulkFromBobble, taskTitlesFromBobble } from '@/src/utils/bobble-tasks';
import { toast } from '@/src/utils/toast';

type UseBobbleToolbarActionsOptions = {
  bobbleId?: string;
  bobble?: Bobble;
};

export function useBobbleToolbarActions({
  bobbleId,
  bobble: bobbleProp,
}: UseBobbleToolbarActionsOptions) {
  const { data: fetchedBobble } = useBobble(bobbleId, !bobbleProp && Boolean(bobbleId));
  const bobble = bobbleProp ?? fetchedBobble;
  const createTasksBulk = useCreateTasksBulk();
  const updateBobble = useUpdateBobble();

  const handleAddTasks = useCallback(() => {
    if (!bobble) {
      toast.error('Bobble is still loading');
      return;
    }

    const titles = taskTitlesFromBobble(bobble);
    if (titles.length === 0) {
      Alert.alert(
        'No tasks found',
        'This bobble does not have suggested tasks yet. Open the Tasks tab to add one manually.',
        [
          { text: 'Cancel', style: 'cancel' },
          { text: 'Open Tasks', onPress: () => router.push('/(tabs)/tasks' as Href) },
        ],
      );
      return;
    }

    createTasksBulk.mutate(buildTasksBulkFromBobble(bobble), {
      onSuccess: (created) => {
        toast.success(`${created.length} task${created.length === 1 ? '' : 's'} added`);
        router.push('/(tabs)/tasks' as Href);
      },
    });
  }, [bobble, createTasksBulk]);

  const handlePin = useCallback(() => {
    if (!bobble?._id || updateBobble.isPending) return;

    const nextPinned = !bobble.pinned;
    updateBobble.mutate(
      { id: bobble._id, body: { pinned: nextPinned } },
      {
        onSuccess: () => {
          toast.success(nextPinned ? 'Bobble pinned to your library' : 'Bobble unpinned');
        },
      },
    );
  }, [bobble, updateBobble]);

  return {
    bobble,
    handleAddTasks,
    handlePin,
    isAddingTasks: createTasksBulk.isPending,
    isPinning: updateBobble.isPending,
  };
}
