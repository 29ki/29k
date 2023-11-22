import {useMemo} from 'react';
import useGetExercisesByCollectionId from './useGetExercisesByCollectionId';

const useExercisesByCollectionId = (collectionId?: string) => {
  const getExercisesByCollectionId = useGetExercisesByCollectionId();

  return useMemo(
    () => (collectionId ? getExercisesByCollectionId(collectionId) : []),
    [collectionId, getExercisesByCollectionId],
  );
};

export default useExercisesByCollectionId;
