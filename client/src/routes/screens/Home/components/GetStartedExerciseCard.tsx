import React from 'react';
import {COLORS} from '../../../../../../shared/src/constants/colors';
import ExerciseCard from '../../../../lib/components/Cards/SessionCard/ExerciseCard';
import {useMemo} from 'react';
import useGetStartedExercise from '../../../../lib/content/hooks/useGetStartedExercise';

const GetStartedExericeCard = () => {
  const getStartedExercise = useGetStartedExercise();

  const exercise = useMemo(
    () =>
      getStartedExercise && {
        ...getStartedExercise,
        card: {
          lottie: {
            source:
              'https://res.cloudinary.com/cupcake-29k/raw/upload/v1701356650/Lottie/aware_logo_2023_pure_white_margin_h0ggq0.json',
          },
        },
      },
    [getStartedExercise],
  );

  if (!exercise) return null;

  return (
    <ExerciseCard
      exercise={exercise}
      backgroundColor={COLORS.PRIMARY}
      textColor={COLORS.PURE_WHITE}
    />
  );
};

export default GetStartedExericeCard;
