import {useCallback, useMemo} from 'react';
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import useUserState from '../state/state';
import usePinnedCollections from './usePinnedCollections';
import * as metrics from '../../metrics';
import useConfirmPracticeReminders from '../../sessions/hooks/useConfirmPracticeReminders';

dayjs.extend(utc);

const usePinCollection = (collectionId: string) => {
  const {pinnedCollections} = usePinnedCollections();
  const setPinnedCollections = useUserState(
    state => state.setPinnedCollections,
  );
  const confirmPracticeReminder = useConfirmPracticeReminders();

  const togglePinned = useCallback(async () => {
    if (pinnedCollections.find(ps => ps.id === collectionId)) {
      setPinnedCollections(
        pinnedCollections.filter(ps => ps.id !== collectionId),
      );
    } else {
      setPinnedCollections([
        ...pinnedCollections,
        {
          id: collectionId,
          startedAt: dayjs().utc().toJSON(),
        },
      ]);
      await confirmPracticeReminder(true);
      metrics.logEvent('Add Collection To Journey', {
        'Collection ID': collectionId,
      });
    }
  }, [
    collectionId,
    setPinnedCollections,
    confirmPracticeReminder,
    pinnedCollections,
  ]);

  const isPinned = useMemo(
    () => Boolean(pinnedCollections.find(ps => ps.id === collectionId)),
    [collectionId, pinnedCollections],
  );

  return {togglePinned, isPinned};
};

export default usePinCollection;
