import {useCallback} from 'react';
import {useTranslation} from 'react-i18next';
import {Collection} from '../../../../../shared/src/types/generated/Collection';
import {LANGUAGE_TAG} from '../../i18n';

const useGetCollectionById = () => {
  const {t} = useTranslation('collections');

  return useCallback(
    (id: string, language?: LANGUAGE_TAG) =>
      t(id, {
        returnObjects: true,
        lng: language,
      }) as Collection,
    [t],
  );
};

export default useGetCollectionById;
