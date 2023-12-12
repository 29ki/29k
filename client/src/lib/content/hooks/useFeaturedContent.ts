import content from '../../../../../content/content.json';

const useFeaturedContent = () => {
  const {featured} = content;
  return featured;
};

export const useFeaturedExerciseIds = () => {
  const {exercises} = useFeaturedContent();
  return exercises;
};

export const useFeaturedCollectionIds = () => {
  const {collections} = useFeaturedContent();
  return collections;
};

export default useFeaturedContent;
