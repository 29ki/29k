import {isNotNil} from 'ramda';
import {useMemo} from 'react';
import {Exercise} from '../../../../../shared/src/types/generated/Exercise';
import useCollectionById from './useCollectionById';
import useGetExerciseById from './useGetExerciseById';
import useAppState from '../../appState/state/state';

const useExercisesByCollectionId = (collectionId?: string) => {
  const {showHiddenContent} = useAppState(state => state.settings);
  const collection = useCollectionById(collectionId);
  const getExerciseById = useGetExerciseById();

  return useMemo(() => {
    if (collection) {
      return collection.exercises
        .map(id => getExerciseById(id))
        .filter(isNotNil)
        .filter(e => showHiddenContent || !e.hidden);
    }
    return [];
  }, [collection, showHiddenContent, getExerciseById]);
};

export default useExercisesByCollectionId;
