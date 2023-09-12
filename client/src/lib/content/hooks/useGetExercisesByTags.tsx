import {intersection, take} from 'ramda';
import {useMemo} from 'react';
import useAppState from '../../appState/state/state';
import useExercises from './useExercises';
import {Tag} from '../../../../../shared/src/types/generated/Tag';

const useGetExercisesByTags = (tags: Tag[], excludeId?: string) => {
  const {showHiddenContent} = useAppState(state => state.settings);
  const exercises = useExercises();
  const tagNames = useMemo(() => tags.map(t => t.tag), [tags]);

  return useMemo(() => {
    const exerciseList = exercises
      .filter(e => showHiddenContent || !e.hidden)
      .filter(
        e =>
          intersection(
            (e.tags || []).map(t => t.tag),
            tagNames,
          ).length > 0 && e.id !== excludeId,
      );

    return take(5, exerciseList);
  }, [tagNames, exercises, showHiddenContent, excludeId]);
};

export default useGetExercisesByTags;
