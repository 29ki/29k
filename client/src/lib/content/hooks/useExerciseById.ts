import {useMemo} from 'react';
import {useTranslation} from 'react-i18next';
import {Exercise} from '../../../../../shared/src/types/generated/Exercise';

const useExerciseById = (id: string | undefined): Exercise | null => {
  const {t} = useTranslation('exercises');

  return useMemo(
    () =>
      id
        ? (t(id, {
            returnObjects: true,
          }) as Exercise)
        : null,
    [id, t],
  );
};

export default useExerciseById;
