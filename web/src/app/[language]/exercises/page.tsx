'use client';

import styled, {css, keyframes} from 'styled-components';
import {
  Spacer16,
  Spacer24,
  Spacer32,
  Spacer8,
} from '../../../../../client/src/lib/components/Spacers/Spacer';
import useExercises from '../../../../../client/src/lib/content/hooks/useExercises';
import ExerciseCard from '../../../../../client/src/lib/components/Cards/SessionCard/ExerciseCard';
import Link from 'next/link';
import {LogoIcon} from '../../../../../client/src/lib/components/Icons';
import LogoAware from './components/LogoAware';
import {Heading18} from '../../../../../client/src/lib/components/Typography/Heading/Heading';
import {useTranslation} from 'react-i18next';
import Logo from './components/Logo';

const Gutters = styled.div({
  padding: '0 16px',
  '@media(min-width: 720px)': {
    padding: '0 32px',
  },
});

const Columns = styled.div({
  display: 'grid',
  '@media(min-width: 720px)': {
    gridTemplateColumns: '1fr 1fr',
    columnGap: 16,
  },
});

const StyledLogo = styled(Logo)({
  height: 46,
  width: 160,
});

const Header = styled.header({});

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
