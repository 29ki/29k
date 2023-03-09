import {useMemo} from 'react';
import {Exercise} from '../../../../../shared/src/types/generated/Exercise';
import useCollectionById from './useCollectionById';
import useGetExerciseById from './useGetExerciseById';

const useExercisesByCollectionId = (collectionId?: string) => {
  const collection = useCollectionById(collectionId);
  const getExerciseById = useGetExerciseById();

  return useMemo(() => {
    if (collection) {
      return collection.exercises
        .map(id => getExerciseById(id))
        .filter(Boolean)
        .filter(e => !e.hidden) as Array<Exercise>;
    }
    return [];
  }, [collection, getExerciseById]);
};

export default useExercisesByCollectionId;
