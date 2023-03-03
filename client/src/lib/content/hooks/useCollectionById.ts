import {useMemo} from 'react';
import {Collection} from '../../../../../shared/src/types/generated/Collection';
import useGetCollectionById from './useGetCollectionById';

const useCollectionById = (id: string | undefined): Collection | null => {
  const getCollectionById = useGetCollectionById();

  return useMemo(
    () => (id ? getCollectionById(id) : null),
    [getCollectionById, id],
  );
};

export default useCollectionById;
