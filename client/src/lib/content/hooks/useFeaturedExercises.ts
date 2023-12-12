import useExercises from './useExercises';
import {useFeaturedExerciseIds} from './useFeaturedContent';

const useFeaturedExercises = () => useExercises(useFeaturedExerciseIds());

export default useFeaturedExercises;
