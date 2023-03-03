import {useCallback} from 'react';
import {useTranslation} from 'react-i18next';
import {Collection} from '../../../../../shared/src/types/generated/Collection';
import {LANGUAGE_TAG} from '../../i18n';

const useGetCollectionById = () => {
  const {t} = useTranslation('collections');

  // If there are no collections t return the given input
  // Check that it's actually an object
  return useCallback(
    (id: string, language?: LANGUAGE_TAG) => {
      const collection = t(id, {
        returnObjects: true,
        lng: language,
      });
      if (typeof collection === 'object') {
        return collection as Collection;
      }
      return null;
    },
    [t],
  );
};

export default useGetCollectionById;
