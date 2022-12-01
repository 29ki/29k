import {useMemo} from 'react';
import {useTranslation} from 'react-i18next';
import {exerciseIds} from '../../../../../content/content.json';
import {Exercise} from '../../../../../shared/src/types/generated/Exercise';
import useAppState from '../../appState/state/state';

const useExerciseIds = () => {
  const {t} = useTranslation('exercises');
  const showNonPublishedContent = useAppState(
    state => state.showNonPublishedContent,
  );
  const ids = exerciseIds as Array<string>;

  const onlyPublished = useMemo(() => {
    const pred = (id: string) => {
      // @ts-expect-error variable/string litteral as key is not yet supported https://www.i18next.com/overview/typescript#type-error-template-literal
      const exercise = t(id, {
        returnObjects: true,
      }) as Exercise;

      return exercise?.published === true;
    };

    return ids.filter(pred);
  }, [t, ids]);

  return showNonPublishedContent ? ids : onlyPublished;
};

export default useExerciseIds;
