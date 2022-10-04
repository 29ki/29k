import {useTranslation} from 'react-i18next';
import {Exercise} from '../../../../../shared/src/types/Content';
import NS from '../../i18n/constants/namespaces';

const useGetExerciseById = (): ((
  id: string | undefined,
) => Exercise | null) => {
  const {t} = useTranslation(NS.EXERCISES);

  const getExerciseById = (id: string | undefined): Exercise | null => {
    if (id) {
      const exercise: Exercise = t(id, {
        returnObjects: true,
      });

      if (!exercise.published) {
        return null;
      }

      return exercise;
    } else {
      return null;
    }
  };

  return getExerciseById;
};

export default useGetExerciseById;
