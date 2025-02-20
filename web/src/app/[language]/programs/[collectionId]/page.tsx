'use client';

import styled from 'styled-components';
import styledNative from 'styled-components/native';
import {Heading18} from '../../../../../../client/src/lib/components/Typography/Heading/Heading';
import useCollectionById from '../../../../../../client/src/lib/content/hooks/useCollectionById';
import {LANGUAGE_TAG} from '../../../../../../shared/src/i18n/constants';
import Logo from '@/lib/components/Logo';
import {
  Spacer16,
  Spacer24,
  Spacer32,
  Spacer4,
  Spacer8,
} from '../../../../../../client/src/lib/components/Spacers/Spacer';
import Gutters from '@/lib/components/Gutters';
import {Display36} from '../../../../../../client/src/lib/components/Typography/Display/Display';
import {Body14} from '../../../../../../client/src/lib/components/Typography/Body/Body';
import Markdown from '../../../../../../client/src/lib/components/Typography/Markdown/Markdown';
import Columns from '@/lib/components/Columns';
import {useTranslation} from 'react-i18next';
import useExercisesByCollectionId from '../../../../../../client/src/lib/content/hooks/useExercisesByCollectionId';
import Link from 'next/link';
import ExerciseCard from '../../../../../../client/src/lib/components/Cards/SessionCard/ExerciseCard';
import CardGraphic from '../../../../../../client/src/lib/components/CardGraphic/CardGraphic';
import {Fragment, MouseEventHandler, useCallback, useState} from 'react';
import {ExerciseWithLanguage} from '../../../../../../client/src/lib/content/types';
import ExerciseModal from '@/lib/components/ExerciseModal';
import Footer from '@/lib/components/Footer';

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

const Description = styled.div({
  display: 'grid',
  gridTemplateColumns: '1fr 1fr',
});

const Heading = styled.div({
  gridColumnStart: 1,
  gridColumnEnd: 3,
  '@media(min-width: 720px)': {
    gridColumnEnd: 1,
  },
});

const Text = styled.div({
  gridRowStart: 2,
});

const Graphic = styled.div({
  display: 'flex',
  flexShrink: 0,
  justifyContent: 'flex-end',
  height: 112,
  gridRowStart: 2,
  gridColumnStart: 2,
  '@media(min-width: 720px)': {
    gridRowStart: 1,
    gridRowEnd: 3,
    height: 150,
  },
});

const CoCreators = styled.div({
  display: 'flex',
  flexDirection: 'row',
  flexWrap: 'wrap',
});

const CoCreator = styled(Link)({
  display: 'flex',
  width: 90,
  flexDirection: 'column',
  alignItems: 'center',
  textDecoration: 'none',
  textAlign: 'center',
  marginRight: 16,
  marginTop: 8,
  marginBottom: 8,
});

const CoCreatorImage = styled.img({
  width: 90,
  height: 90,
  borderRadius: 45,
});

const CoCreatorName = styledNative(Body14)({
  textAlign: 'center',
});

export default function ExercisePage({
  params: {language, collectionId},
}: {
  params: {language: LANGUAGE_TAG; collectionId: string};
}) {
  const {t} = useTranslation('Screen.Collection');
  const collection = useCollectionById(collectionId, undefined, true);
  const exercises = useExercisesByCollectionId(collectionId, undefined, true);

  const [exerciseModal, setExerciseModal] =
    useState<ExerciseWithLanguage | null>(null);

  const onExerciseClick = useCallback(
    (exercise: ExerciseWithLanguage): MouseEventHandler<HTMLAnchorElement> =>
      e => {
        e.preventDefault();
        setExerciseModal(exercise);
      },
    [],
  );

  const onCloseModal = useCallback(() => {
    setExerciseModal(null);
  }, []);

  if (!collection) return null;

  return (
    <>
      <Gutters>
        <Spacer32 />
        <Header>
          <StyledLogo />
        </Header>
        <Spacer24 />
        <Description>
          <Heading>
            <Display36>{collection.name}</Display36>
            <Spacer16 />
          </Heading>
          <Graphic>
            <CardGraphic graphic={collection.card} />
          </Graphic>
          <Text>
            <Markdown>{collection.description}</Markdown>
          </Text>
          <Spacer16 />
        </Description>
        {!!collection?.coCreators?.length && (
          <>
            <Heading18>{t('coCreatorsHeading')}</Heading18>
            <CoCreators>
              {collection.coCreators.map(coCreator => (
                <Fragment key={coCreator.url}>
                  <CoCreator href={coCreator.url} target="_blank">
                    <CoCreatorImage src={coCreator.image} />
                    <Spacer4 />
                    <CoCreatorName>{coCreator.name}</CoCreatorName>
                  </CoCreator>
                </Fragment>
              ))}
            </CoCreators>
          </>
        )}
        <Spacer24 />
        <Heading18>{t('sessionsHeading')}</Heading18>
        <Spacer8 />
        <Columns>
          {exercises
            .filter(({hidden}) => !hidden)
            .map(exercise => (
              <div key={exercise.id}>
                <StyledLink
                  href={`/${exercise.language}/exercises/${exercise.id}`}
                  onClick={onExerciseClick(exercise)}>
                  <ExerciseCard exercise={exercise} />
                </StyledLink>
                <Spacer16 />
              </div>
            ))}
        </Columns>
      </Gutters>
      {exerciseModal && (
        <ExerciseModal exercise={exerciseModal} onClose={onCloseModal} />
      )}
      <Spacer16 />
      <Footer />
    </>
  );
}
