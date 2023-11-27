import {useCallback} from 'react';
import usePinnedCollections from '../../user/hooks/usePinnedCollections';
import useGetExercisesByCollectionId from './useGetExercisesByCollectionId';
import useGetCollectionById from './useGetCollectionById';
import useCompletedSessionByTime from '../../user/hooks/useCompletedSessionByTime';

const useGetActiveCollectionByExerciseId = () => {
  const {pinnedCollections} = usePinnedCollections();
  const getExercisesByCollectionId = useGetExercisesByCollectionId();
  const {getCompletedSessionByExerciseId} = useCompletedSessionByTime();
  const getCollectionById = useGetCollectionById();

  return useCallback(
    (exerciseId: string) => {
      const pinnedCollection = pinnedCollections.find(collection =>
        getExercisesByCollectionId(collection.id).find(
          exercise => exercise.id === exerciseId,
        ),
      );

      if (!pinnedCollection) return;

      if (
        getCompletedSessionByExerciseId(exerciseId, pinnedCollection.startedAt)
      )
        return;

      return getCollectionById(pinnedCollection.id);
    },
    [
      getCollectionById,
      pinnedCollections,
      getCompletedSessionByExerciseId,
      getExercisesByCollectionId,
    ],
  );
};

export default useGetActiveCollectionByExerciseId;
