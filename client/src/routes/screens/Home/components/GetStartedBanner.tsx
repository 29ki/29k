import React from 'react';
import GetStartedExericeCard from './GetStartedExerciseCard';
import Gutters from '../../../../lib/components/Gutters/Gutters';
import {Spacer16} from '../../../../lib/components/Spacers/Spacer';
import useCompletedSessions from '../../../../lib/user/hooks/useCompletedSessions';
import useGetStartedExercise from '../../../../lib/content/hooks/useGetStartedExercise';
import useCompletedExerciseById from '../../../../lib/user/hooks/useCompletedExerciseById';

const GetStartedBanner = () => {
  const getStartedExercise = useGetStartedExercise();
  const getStartedExericseCompleted = useCompletedExerciseById(
    getStartedExercise?.id,
  );
  const {completedSessions} = useCompletedSessions();

  if (getStartedExericseCompleted || !completedSessions.length) return null;

  return (
    <Gutters>
      <GetStartedExericeCard />
      <Spacer16 />
    </Gutters>
  );
};

export default GetStartedBanner;
