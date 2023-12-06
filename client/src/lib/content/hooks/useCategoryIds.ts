import {useTranslation} from 'react-i18next';
import {Category} from '../../../../../shared/src/types/generated/Category';
import {DEFAULT_LANGUAGE_TAG} from '../../i18n';
import {useMemo} from 'react';

const getCategoryIds = (
  content: Record<string, Record<string, string>> | undefined,
) => {
  if (content?.categories) {
    return Object.keys(content.categories);
  }
  return [];
};

const useCategoryIds: () => Category['id'][] = () => {
  const {i18n} = useTranslation('categories');
  // Default to allways list exercises avalible in English
  return useMemo(
    () => getCategoryIds(i18n.getDataByLanguage(DEFAULT_LANGUAGE_TAG)),
    [i18n],
  );
};

export default useCategoryIds;
