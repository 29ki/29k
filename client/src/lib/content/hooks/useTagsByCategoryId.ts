import useCategoryById from './useCategoryById';
import useExercises from './useExercises';
import useCollections from './useCollections';
import {uniq} from 'ramda';
import useTags from './useTags';

const useTagsByCategoryId = (categoryId?: string) => {
  const category = useCategoryById(categoryId);
  const collections = useCollections(category?.collections);
  const exercises = useExercises(category?.exercises);

  const collectionTags = collections.flatMap(collection => collection.tags);
  const exerciseTags = exercises.flatMap(exercise => exercise.tags);

  return useTags(uniq([...collectionTags, ...exerciseTags]));
};

export default useTagsByCategoryId;
