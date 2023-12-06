import {useMemo} from 'react';
import {Tag} from '../../../../../shared/src/types/generated/Tag';
import useGetTagById from './useGetTagById';

const useTagById = (id: string | undefined): Tag | null => {
  const getTagById = useGetTagById();

  return useMemo(() => (id ? getTagById(id) : null), [getTagById, id]);
};

export default useTagById;
