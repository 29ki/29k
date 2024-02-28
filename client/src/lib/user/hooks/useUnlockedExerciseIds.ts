import {useMemo} from 'react';
import useCollections from '../../content/hooks/useCollections';
import useUnlockedCollectionIds from './useUnlockedCollectionIds';

const useUnlockedExerciseIds = () => {
  const unlockedCollectionIds = useUnlockedCollectionIds();
  const collections = useCollections(unlockedCollectionIds ?? []);

  return useMemo(
    () =>
      collections.reduce<string[]>(
        (ids, collection) => [...ids, ...collection.exercises],
        [],
      ),
    [collections],
  );
};

export default useUnlockedExerciseIds;
