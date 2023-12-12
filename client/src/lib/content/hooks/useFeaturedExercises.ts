import {intersection} from 'ramda';
import useExercises from './useExercises';
import {useFeaturedExerciseIds} from './useFeaturedContent';

const useFeaturedExercises = (exericeIds?: string[]) => {
  const featuredIds = useFeaturedExerciseIds();
  const ids = exericeIds ? intersection(featuredIds, exericeIds) : featuredIds;
  return useExercises(ids);
};

export default useFeaturedExercises;
