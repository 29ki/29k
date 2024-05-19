import {useMemo} from 'react';
import {useTranslation} from 'react-i18next';
import useTags from '../../../../content/hooks/useTags';
import {ExerciseWithLanguage} from '../../../../content/types';

const useGetSessionCardTags = (exercise?: ExerciseWithLanguage | null) => {
  const {t} = useTranslation('Component.SessionCard');
  const tagObjs = useTags(exercise?.tags);

  return useMemo(() => {
    let tags = tagObjs.map(tag => tag.name);

    if (exercise?.duration) {
      tags = [`${exercise.duration} ${t('minutesAbbreviation')}`, ...tags];
    }

    return tags;
  }, [t, tagObjs, exercise]);
};

export default useGetSessionCardTags;
