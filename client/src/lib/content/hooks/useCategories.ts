import {isNotNil} from 'ramda';
import {useMemo} from 'react';
import useGetCategoryById from './useGetCategoryById';
import useCategoryIds from './useCategoryIds';
import {Category} from '../../../../../shared/src/types/generated/Category';

const sortByName = (a: Category, b: Category) =>
  a.name < b.name ? -1 : a.name > b.name ? 1 : 0;

const useCategories = () => {
  const categoryIds = useCategoryIds();
  const getCategoryById = useGetCategoryById();

  return useMemo(
    () =>
      categoryIds
        .map(id => getCategoryById(id))
        .filter(isNotNil)
        .sort(sortByName),
    [categoryIds, getCategoryById],
  );
};

export default useCategories;
