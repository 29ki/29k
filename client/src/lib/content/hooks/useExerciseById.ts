import {useMemo} from 'react';
import {useTranslation} from 'react-i18next';
import {ContentSlide} from '../../../../../shared/src/types/Content';
import NS from '../../i18n/constants/namespaces';

const useExerciseById = (id: string | undefined): ContentSlide[] => {
  const {t} = useTranslation(NS.EXERCISES);

  return useMemo(
    () =>
      id
        ? t(id, {
            returnObjects: true,
          })
        : [],
    [id, t],
  );
};

export default useExerciseById;
