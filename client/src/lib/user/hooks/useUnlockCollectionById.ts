import {useCallback, useMemo} from 'react';
import useUserState from '../state/state';
import useCollectionById from '../../content/hooks/useCollectionById';
import {uniq} from 'ramda';
import useCurrentUserState from './useCurrentUserState';

const useUnlockCollectionById = (collectionId: string) => {
  const collection = useCollectionById(collectionId, undefined, true);
  const userState = useCurrentUserState();
  const setCurrentUserState = useUserState(state => state.setCurrentUserState);

  const isUnlocked = useMemo(
    () => Boolean(userState?.unlockedCollectionIds?.includes(collectionId)),
    [collectionId, userState?.unlockedCollectionIds],
  );

  const unlockCollection = useCallback(async () => {
    if (collection) {
      setCurrentUserState(({unlockedCollectionIds = [], ...state}) =>
        isUnlocked
          ? {unlockedCollectionIds, ...state}
          : {
              unlockedCollectionIds: uniq([
                ...unlockedCollectionIds,
                collection.id,
              ]),
            },
      );
    }
  }, [collection, isUnlocked, setCurrentUserState]);

  return {collection, unlockCollection, isUnlocked};
};

export default useUnlockCollectionById;
