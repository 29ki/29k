import {useCallback} from 'react';
import {useTranslation} from 'react-i18next';
import {Tag} from '../../../../../shared/src/types/generated/Tag';

const useGetTagById = () => {
  const {t} = useTranslation('tags');

  return useCallback(
    (id: any) =>
      t(id, {
        returnObjects: true,
      }) as Tag,
    [t],
  );
};

export default useGetTagById;
