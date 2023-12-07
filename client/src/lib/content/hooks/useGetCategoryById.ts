import {useCallback} from 'react';
import {useTranslation} from 'react-i18next';
import {Category} from '../../../../../shared/src/types/generated/Category';
import {LANGUAGE_TAG} from '../../i18n';

const useGetCategoryById = () => {
  const {t} = useTranslation('categories');

  return useCallback(
    (id: string, language?: LANGUAGE_TAG) => {
      const category = t(id, {
        returnObjects: true,
        lng: language,
      });

      // i18next fallbacks to the key if no translation is found
      return typeof category === 'object' ? (category as Category) : null;
    },
    [t],
  );
};

export default useGetCategoryById;
