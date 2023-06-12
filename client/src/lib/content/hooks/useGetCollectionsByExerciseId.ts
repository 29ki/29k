import {useCallback} from 'react';
import useCollections from './useCollections';

const useGetCollectionsByExerciseId = () => {
  const collections = useCollections();

  return useCallback(
    (exerciseId: string) => {
      return collections.filter(c => c.exercises.includes(exerciseId));
    },
    [collections],
  );
};

export default useGetCollectionsByExerciseId;
