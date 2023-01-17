import {useMemo} from 'react';
import {useTranslation} from 'react-i18next';
import {Exercise} from '../../../../../../../shared/src/types/generated/Exercise';
import useGetTagsById from '../../../../content/hooks/useGetTagsById';

const useGetSessionCardTags = (exercise?: Exercise | null) => {
  const {t} = useTranslation('Component.SessionCard');
  const tagObjs = useGetTagsById(exercise?.tags);

  return useMemo(() => {
    let tags = tagObjs.map(tag => tag.tag);

    if (exercise?.duration) {
      tags = [`${exercise.duration} ${t('minutesAbbreviation')}`, ...tags];
    }

    return tags;
  }, [t, tagObjs, exercise]);
};

export default useGetSessionCardTags;
