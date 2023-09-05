import {useCallback} from 'react';
import {useTranslation} from 'react-i18next';
import {Collection} from '../../../../../shared/src/types/generated/Collection';
import {LANGUAGE_TAG} from '../../i18n';

const useGetCollectionById = () => {
  const {t} = useTranslation('collections');

  return useCallback(
    (id: string, language?: LANGUAGE_TAG) => {
      const collection = t(id, {
        returnObjects: true,
        lng: language,
      });

      // i18next fallbacks to the key if no translation is found
      return typeof collection === 'object' ? (collection as Collection) : null;
    },
    [t],
  );
};

export default useGetCollectionById;
