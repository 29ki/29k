import {useTranslation} from 'react-i18next';
import {Collection} from '../../../../../shared/src/types/generated/Collection';
import {DEFAULT_LANGUAGE_TAG} from '../../i18n';
import {useMemo} from 'react';

const getCollectionIds = (
  content: Record<string, Record<string, string>> | undefined,
) => {
  if (content?.collections) {
    return Object.keys(content.collections);
  }
  return [];
};

const useCollectionIds: () => Collection['id'][] = () => {
  const {i18n} = useTranslation('collections');
  // Default to allways list exercises avalible in English
  return useMemo(
    () => getCollectionIds(i18n.getDataByLanguage(DEFAULT_LANGUAGE_TAG)),
    [i18n],
  );
};

export default useCollectionIds;
