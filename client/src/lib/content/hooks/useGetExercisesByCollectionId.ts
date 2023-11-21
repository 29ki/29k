import {useCallback} from 'react';

import {isNotNil} from 'ramda';
import useAppState from '../../appState/state/state';
import useGetExerciseById from './useGetExerciseById';
import useGetCollectionById from './useGetCollectionById';

const useGetExercisesByCollectionId = () => {
  const {showHiddenContent} = useAppState(state => state.settings);
  const getCollectionById = useGetCollectionById();
  const getExerciseById = useGetExerciseById();

  return useCallback(
    (collectionId: string) => {
      const collection = getCollectionById(collectionId);
      if (collection) {
        return collection.exercises
          .map(id => getExerciseById(id))
          .filter(isNotNil)
          .filter(e => showHiddenContent || !e.hidden);
      }
      return [];
    },
    [getCollectionById, getExerciseById, showHiddenContent],
  );
};

export default useGetExercisesByCollectionId;
