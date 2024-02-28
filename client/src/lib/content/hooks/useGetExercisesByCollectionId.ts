import {useCallback} from 'react';

import {isNotNil} from 'ramda';
import useGetExerciseById from './useGetExerciseById';
import useGetCollectionById from './useGetCollectionById';

const useGetExercisesByCollectionId = () => {
  const getCollectionById = useGetCollectionById();
  const getExerciseById = useGetExerciseById();

  return useCallback(
    (collectionId: string) => {
      const collection = getCollectionById(collectionId);
      if (collection) {
        return collection.exercises
          .map(id => getExerciseById(id))
          .filter(isNotNil);
      }
      return [];
    },
    [getCollectionById, getExerciseById],
  );
};

export default useGetExercisesByCollectionId;
