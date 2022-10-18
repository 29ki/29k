import {useMemo} from 'react';
import {useTranslation} from 'react-i18next';
import {Exercise} from '../../../../../shared/src/types/generated/Exercise';
import NS from '../../i18n/constants/namespaces';

const useExerciseById = (id: string | undefined): Exercise | null => {
  const {t} = useTranslation(NS.EXERCISES);

  return useMemo(
    () =>
      id
        ? t(id, {
            returnObjects: true,
          })
        : null,
    [id, t],
  );
};

export default useExerciseById;
