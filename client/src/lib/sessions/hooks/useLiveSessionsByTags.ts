import useExercisesByTags from '../../content/hooks/useExercisesByTags';
import useLiveSessionsByExercises from './useLiveSessionsByExerciseIds';

const useLiveSessionsByTags = (filterTags: string[] = []) =>
  useLiveSessionsByExercises(useExercisesByTags(filterTags));

export default useLiveSessionsByTags;
