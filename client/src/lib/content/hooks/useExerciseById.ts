import {useMemo} from 'react';
import {useTranslation} from 'react-i18next';
import {Exercise} from '../../../../../shared/src/types/generated/Exercise';

const useExerciseById = (id: string | undefined): Exercise | null => {
  const {t} = useTranslation('exercises');

  return useMemo(
    () =>
      id
        ? // @ts-expect-error variable/string litteral as key is not yet supported https://www.i18next.com/overview/typescript#type-error-template-literal
          (t(id, {
            returnObjects: true,
          }) as Exercise)
        : null,
    [id, t],
  );
};

export default useExerciseById;
