import {useCallback} from 'react';

import {isNotNil} from 'ramda';
import useGetExerciseById from './useGetExerciseById';
import useGetCollectionById from './useGetCollectionById';
import {LANGUAGE_TAG} from '../../i18n';

const useGetExercisesByCollectionId = () => {
  const getCollectionById = useGetCollectionById();
  const getExerciseById = useGetExerciseById();

  return useCallback(
    (collectionId: string, language?: LANGUAGE_TAG, ignoreLocked?: boolean) => {
      const collection = getCollectionById(
        collectionId,
        language,
        ignoreLocked,
      );
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
