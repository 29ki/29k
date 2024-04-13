import {useMemo} from 'react';
import {useTranslation} from 'react-i18next';
import useTags from '../../../../content/hooks/useTags';
import {LANGUAGES} from '../../../../i18n';
import {ExerciseWithLanguage} from '../../../../content/types';

const useGetSessionCardTags = (exercise?: ExerciseWithLanguage | null) => {
  const {t, i18n} = useTranslation('Component.SessionCard');
  const tagObjs = useTags(exercise?.tags);

  return useMemo(() => {
    let tags = tagObjs.map(tag => tag.name);

    if (exercise?.duration) {
      tags = [`${exercise.duration} ${t('minutesAbbreviation')}`, ...tags];
    }

    if (exercise && exercise.language !== i18n.resolvedLanguage) {
      tags = [LANGUAGES[exercise.language], ...tags];
    }

    return tags;
  }, [t, i18n.resolvedLanguage, tagObjs, exercise]);
};

export default useGetSessionCardTags;
