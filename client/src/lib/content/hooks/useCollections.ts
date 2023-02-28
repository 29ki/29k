import {useMemo} from 'react';
import {useTranslation} from 'react-i18next';

import useAppState from '../../appState/state/state';
import {DEFAULT_LANGUAGE_TAG} from '../../i18n';
import useGetCollectionById from './useGetCollectionById';

const getCollectionIds = (
  content: Record<string, Record<string, string>> | undefined,
) => {
  if (content) {
    return Object.keys(content.collections);
  }
  return [];
};

const useCollections = () => {
  const {i18n} = useTranslation('collections');
  const getCollectionById = useGetCollectionById();
  const preferedLanguage = useAppState(
    state => state.settings.preferredLanguage,
  );

  return useMemo(() => {
    const collectionIds = getCollectionIds(
      i18n.getDataByLanguage(preferedLanguage ?? DEFAULT_LANGUAGE_TAG),
    );

    return collectionIds.map(id =>
      getCollectionById(id, preferedLanguage ?? DEFAULT_LANGUAGE_TAG),
    );
  }, [i18n, preferedLanguage, getCollectionById]);
};

export default useCollections;
