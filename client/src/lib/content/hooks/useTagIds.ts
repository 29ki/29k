import {useTranslation} from 'react-i18next';
import {Tag} from '../../../../../shared/src/types/generated/Tag';
import {DEFAULT_LANGUAGE_TAG} from '../../i18n';
import {useMemo} from 'react';

const getTagIds = (
  content: Record<string, Record<string, string>> | undefined,
) => {
  if (content?.tags) {
    return Object.keys(content.tags);
  }
  return [];
};

const useTagIds: () => Tag['id'][] = () => {
  const {i18n} = useTranslation('tags');
  // Default to allways list exercises avalible in English
  return useMemo(
    () => getTagIds(i18n.getDataByLanguage(DEFAULT_LANGUAGE_TAG)),
    [i18n],
  );
};

export default useTagIds;
