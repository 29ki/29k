import {useCallback, useMemo} from 'react';
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import useUserState from '../state/state';
import usePinnedCollections from './usePinnedCollections';
import * as metrics from '../../metrics';

dayjs.extend(utc);

const usePinCollection = (collectionId: string) => {
  const {pinnedCollections} = usePinnedCollections();
  const setPinnedCollections = useUserState(
    state => state.setPinnedCollections,
  );

  const togglePinned = useCallback(() => {
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
      metrics.logEvent('Add Collection To Journey', {
        'Collection ID': collectionId,
      });
    }
  }, [collectionId, setPinnedCollections, pinnedCollections]);

  const isPinned = useMemo(
    () => Boolean(pinnedCollections.find(ps => ps.id === collectionId)),
    [collectionId, pinnedCollections],
  );

  return {togglePinned, isPinned};
};

export default usePinCollection;
