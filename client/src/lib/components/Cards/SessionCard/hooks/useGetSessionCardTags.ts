import {useMemo} from 'react';
import {useTranslation} from 'react-i18next';
import useTags from '../../../../content/hooks/useTags';
import {ExerciseWithLanguage} from '../../../../content/types';
import {SessionMode} from '../../../../../../../shared/src/schemas/Session';

const useGetSessionCardTags = (
  exercise?: ExerciseWithLanguage | null,
  sessionMode: SessionMode = SessionMode.async,
) => {
  const {t} = useTranslation('Component.SessionCard');
  const tagObjs = useTags(exercise?.tags);

  return useMemo(() => {
    let tags = tagObjs.map(tag => tag.name);

    if (sessionMode === SessionMode.async && exercise?.asyncDuration) {
      tags = [`${exercise.asyncDuration} ${t('minutesAbbreviation')}`, ...tags];
    }

    if (sessionMode === SessionMode.live && exercise?.liveDuration) {
      tags = [`${exercise.liveDuration} ${t('minutesAbbreviation')}`, ...tags];
    }

    return tags;
  }, [t, tagObjs, exercise, sessionMode]);
};

export default useGetSessionCardTags;
