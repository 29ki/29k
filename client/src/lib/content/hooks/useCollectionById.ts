import {useMemo} from 'react';
import {Collection} from '../../../../../shared/src/types/generated/Collection';
import useGetCollectionById from './useGetCollectionById';
import {LANGUAGE_TAG} from '../../i18n';

const useCollectionById = (
  id: string | undefined,
  language?: LANGUAGE_TAG,
  ignoreLocked?: boolean,
): Collection | null => {
  const getCollectionById = useGetCollectionById();

  return useMemo(
    () => (id ? getCollectionById(id, language, ignoreLocked) : null),
    [getCollectionById, id, language, ignoreLocked],
  );
};

export default useCollectionById;
