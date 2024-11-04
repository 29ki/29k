import {useMemo} from 'react';
import useGetExercisesByCollectionId from './useGetExercisesByCollectionId';
import {LANGUAGE_TAG} from '../../i18n';

const useExercisesByCollectionId = (
  collectionId?: string,
  language?: LANGUAGE_TAG,
  ignoreLocked?: boolean,
) => {
  const getExercisesByCollectionId = useGetExercisesByCollectionId();

  return useMemo(
    () =>
      collectionId
        ? getExercisesByCollectionId(collectionId, language, ignoreLocked)
        : [],
    [collectionId, language, ignoreLocked, getExercisesByCollectionId],
  );
};

export default useExercisesByCollectionId;
