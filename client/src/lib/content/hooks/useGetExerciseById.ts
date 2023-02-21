import {useCallback} from 'react';
import {useTranslation} from 'react-i18next';
import {Exercise} from '../../../../../shared/src/types/generated/Exercise';
import {LANGUAGE_TAG} from '../../i18n';

const useGetExerciseById = () => {
  const {t} = useTranslation('exercises');

  return useCallback(
    (id: string, language?: LANGUAGE_TAG) =>
      t(id, {
        returnObjects: true,
        lng: language,
      }) as Exercise,
    [t],
  );
};

export default useGetExerciseById;
