import {useMemo} from 'react';
import useGetCollectionById from './useGetCollectionById';
import {LANGUAGE_TAG} from '../../i18n';
import {CollectionWithLanguage} from '../types';

const useCollectionById = (
  id: string | undefined,
  language?: LANGUAGE_TAG,
  ignoreLocked?: boolean,
): CollectionWithLanguage | null => {
  const getCollectionById = useGetCollectionById();

  return useMemo(
    () => (id ? getCollectionById(id, language, ignoreLocked) : null),
    [getCollectionById, id, language, ignoreLocked],
  );
};

export default useCollectionById;
