import React, {Fragment} from 'react';
import {Exercise} from '../../../../../../shared/src/types/generated/Exercise';
import useExercisesByTags from '../../../../lib/content/hooks/useExercisesByTags';
import ExerciseCard from '../../../../lib/components/Cards/SessionCard/ExerciseCard';
import Gutters from '../../../../lib/components/Gutters/Gutters';
import {Spacer8, Spacer16} from '../../../../lib/components/Spacers/Spacer';
import {Heading16} from '../../../../lib/components/Typography/Heading/Heading';
import {useTranslation} from 'react-i18next';
import useLiveSessionsByExercise from '../../../../lib/session/hooks/useLiveSessionsByExercise';
import SessionCard from '../../../../lib/components/Cards/SessionCard/SessionCard';

type Props = {
  exercise: Exercise;
};
const RelatedSessions: React.FC<Props> = ({exercise}) => {
  const {t} = useTranslation('Modal.SharingPost');

  const {sessions} = useLiveSessionsByExercise(exercise?.id && exercise, 5);

  const relatedExercises = useExercisesByTags(exercise?.tags, exercise?.id, 5);

  if (!exercise) return null;

  return (
    <>
      {Boolean(sessions.length) && (
        <Gutters>
          <Heading16>{t('joinUpcoming')}</Heading16>
          <Spacer8 />
          {sessions.map(item => (
            <Fragment key={item.id}>
              <SessionCard session={item} small />
              <Spacer16 />
            </Fragment>
          ))}
          <Spacer8 />
        </Gutters>
      )}
      {Boolean(relatedExercises?.length) && (
        <Gutters>
          <Heading16>{t('moreLikeThis')}</Heading16>
          <Spacer8 />
          {relatedExercises.map(exerc => (
            <Fragment key={exerc.id}>
              <ExerciseCard exercise={exerc} small />
              <Spacer16 />
            </Fragment>
          ))}
          <Spacer8 />
        </Gutters>
      )}
    </>
  );
};

export default RelatedSessions;
