'use client';

import styled from 'styled-components';
import Card from '../../../../client/src/lib/components/Cards/Card';
import Gutters from '../../../../client/src/lib/components/Gutters/Gutters';
import {
  Spacer16,
  Spacer32,
} from '../../../../client/src/lib/components/Spacers/Spacer';
import useExercises from '../../../../client/src/lib/content/hooks/useExercises';
import ExerciseCard from '../../../../client/src/lib/components/Cards/SessionCard/ExerciseCard';
import Link from 'next/link';

const Wrapper = styled.div({
  margin: '0 auto',
  maxWidth: 600,
});

const StyledLink = styled(Link)({
  textDecoration: 'none',
});

export default function ExercisePage({params}: {params: {exerciseId: string}}) {
  const exercises = useExercises();
  return (
    <Wrapper>
      <Gutters>
        <Spacer16 />
        {exercises
          .filter(({hidden, locked}) => !hidden && !locked)
          .map(exercise => (
            <div key={exercise.id}>
              <StyledLink
                href={`/${exercise.language}/exercises/${exercise.id}`}>
                <ExerciseCard exercise={exercise} />
              </StyledLink>
              <Spacer32 />
            </div>
          ))}
      </Gutters>
    </Wrapper>
  );
}
