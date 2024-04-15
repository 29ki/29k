import {useCallback, useMemo} from 'react';
import dayjs from 'dayjs';
import useUserState from '../state/state';
import usePinnedCollections from './usePinnedCollections';
import * as metrics from '../../metrics';
import useConfirmPracticeReminders from '../../reminders/hooks/useConfirmPracticeReminders';

const usePinCollection = (collectionId: string) => {
  const {pinnedCollections} = usePinnedCollections();
  const setPinnedCollections = useUserState(
    state => state.setPinnedCollections,
  );
  const confirmPracticeReminder = useConfirmPracticeReminders();

  const togglePinned = useCallback(
    async (enabled?: boolean, promptPracticeReminder: boolean = true) => {
      const isPinned = pinnedCollections.find(ps => ps.id === collectionId);

      if (isPinned && !enabled) {
        setPinnedCollections(
          pinnedCollections.filter(ps => ps.id !== collectionId),
        );
      } else if (!isPinned && enabled !== false) {
        setPinnedCollections([
          ...pinnedCollections,
          {
            id: collectionId,
            startedAt: dayjs().utc().toJSON(),
          },
        ]);
        if (promptPracticeReminder) {
          await confirmPracticeReminder(true);
        }
        metrics.logEvent('Add Collection To Journey', {
          'Collection ID': collectionId,
        });
      }
    },
    [
      collectionId,
      setPinnedCollections,
      confirmPracticeReminder,
      pinnedCollections,
    ],
  );

  const isPinned = useMemo(
    () => Boolean(pinnedCollections.find(ps => ps.id === collectionId)),
    [collectionId, pinnedCollections],
  );

  return {togglePinned, isPinned};
};

export default usePinCollection;
