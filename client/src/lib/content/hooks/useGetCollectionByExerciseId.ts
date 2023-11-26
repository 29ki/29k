import {useCallback} from 'react';
import usePinnedCollections from '../../user/hooks/usePinnedCollections';
import useGetExercisesByCollectionId from './useGetExercisesByCollectionId';
import useGetCollectionById from './useGetCollectionById';

const useGetCollectionByExerciseId = () => {
  const {pinnedCollections} = usePinnedCollections();
  const getExercisesByCollectionId = useGetExercisesByCollectionId();
  const getCollectionById = useGetCollectionById();

  return useCallback(
    (exerciseId: string) => {
      const pinnedCollection = pinnedCollections.find(collection =>
        getExercisesByCollectionId(collection.id).find(
          exercise => exercise.id === exerciseId,
        ),
      );

      if (pinnedCollection) {
        return getCollectionById(pinnedCollection.id);
      }
    },
    [getCollectionById, pinnedCollections, getExercisesByCollectionId],
  );
};

export default useGetCollectionByExerciseId;
