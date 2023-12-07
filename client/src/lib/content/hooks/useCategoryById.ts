import {useMemo} from 'react';
import {Category} from '../../../../../shared/src/types/generated/Category';
import useGetCategoryById from './useGetCategoryById';

const useCategoryById = (id: string | undefined): Category | null => {
  const getCategoryById = useGetCategoryById();

  return useMemo(
    () => (id ? getCategoryById(id) : null),
    [getCategoryById, id],
  );
};

export default useCategoryById;
