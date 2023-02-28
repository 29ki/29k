import {useCallback, useMemo} from 'react';
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import useUserState from '../state/state';
import useSavedCollections from './useSavedCollections';

dayjs.extend(utc);

const useSaveCollection = (collectionId: string) => {
  const {savedCollections} = useSavedCollections();
  const setSavedCollections = useUserState(state => state.setSavedCollections);

  const toggleSaved = useCallback(() => {
    if (savedCollections.find(ps => ps.id === collectionId)) {
      setSavedCollections(
        savedCollections.filter(ps => ps.id !== collectionId),
      );
    } else {
      setSavedCollections([
        ...savedCollections,
        {
          id: collectionId,
          statedAt: dayjs().utc().toJSON(),
        },
      ]);
    }
  }, [collectionId, setSavedCollections, savedCollections]);

  const isSaved = useMemo(
    () => Boolean(savedCollections.find(ps => ps.id === collectionId)),
    [collectionId, savedCollections],
  );

  return {toggleSaved, isSaved};
};

export default useSaveCollection;
