import {useMemo} from 'react';
import {useTranslation} from 'react-i18next';
import {Exercise} from '../../../../../shared/src/types/generated/Exercise';
import useAppState from '../../appState/state/state';
import {DEFAULT_LANGUAGE_TAG} from '../../i18n';

const getExerciseIds = (
  content: Record<string, Record<string, string>> | undefined,
) => {
  if (content) {
    return Object.keys(content.exercises);
  }
  return [];
};

const useExerciseIds = () => {
  const {t, i18n} = useTranslation('exercises');
  const showNonPublishedContent = useAppState(
    state => state.showNonPublishedContent,
  );

  const ids = getExerciseIds(i18n.getDataByLanguage(DEFAULT_LANGUAGE_TAG));

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
