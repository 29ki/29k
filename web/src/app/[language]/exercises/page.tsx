'use client';

import styled from 'styled-components';
import {
  Spacer16,
  Spacer24,
  Spacer32,
  Spacer8,
} from '../../../../../client/src/lib/components/Spacers/Spacer';
import useExercises from '../../../../../client/src/lib/content/hooks/useExercises';
import ExerciseCard from '../../../../../client/src/lib/components/Cards/SessionCard/ExerciseCard';
import Link from 'next/link';
import {Heading18} from '../../../../../client/src/lib/components/Typography/Heading/Heading';
import {useTranslation} from 'react-i18next';
import Logo from '@/lib/components/Logo';
import LanguageSelect from '@/lib/components/LanguageSelect';
import Columns from '@/lib/components/Columns';
import Gutters from '@/lib/components/Gutters';

const StyledLogo = styled(Logo)({
  height: 46,
  width: 160,
});

const Header = styled.header({
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
});

const StyledLink = styled(Link)({
  display: 'block',
  textDecoration: 'none',
});

export default function ExercisePage() {
  const {t} = useTranslation('Screen.Explore');
  const exercises = useExercises();

  return (
    <Gutters>
      <Spacer32 />
      <Header>
        <StyledLogo />
        <LanguageSelect />
      </Header>
      <Spacer24 />
      <Heading18>{t('sessionsHeading')}</Heading18>
      <Spacer8 />
      <Columns>
        {exercises
          .filter(({hidden, locked}) => !hidden && !locked)
          .map(exercise => (
            <div key={exercise.id}>
              <StyledLink
                href={`/${exercise.language}/exercises/${exercise.id}`}>
                <ExerciseCard exercise={exercise} />
              </StyledLink>
              <Spacer16 />
            </div>
          ))}
      </Columns>
    </Gutters>
  );
}
