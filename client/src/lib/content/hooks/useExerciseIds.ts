import {useMemo} from 'react';
import {useTranslation} from 'react-i18next';
import {Exercise} from '../../../../../shared/src/types/Content';

const useExerciseIds = (): Exercise['id'][] => {
  const {t} = useTranslation('contentIds');

  return useMemo(
    () =>
      t('exercises', {
        returnObjects: true,
      }),
    [t],
  );
};

export default useExerciseIds;
