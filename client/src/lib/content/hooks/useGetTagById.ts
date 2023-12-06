import {useCallback} from 'react';
import {useTranslation} from 'react-i18next';
import {Tag} from '../../../../../shared/src/types/generated/Tag';
import {LANGUAGE_TAG} from '../../i18n';

const useGetTagById = () => {
  const {t} = useTranslation('tags');

  return useCallback(
    (id: string, language?: LANGUAGE_TAG) => {
      const tag = t(id, {
        returnObjects: true,
        lng: language,
      });

      // i18next fallbacks to the key if no translation is found
      return typeof tag === 'object' ? (tag as Tag) : null;
    },
    [t],
  );
};

export default useGetTagById;
