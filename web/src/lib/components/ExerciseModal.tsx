import styled from 'styled-components';
import styledNative from 'styled-components/native';
import {ExerciseWithLanguage} from '../../../../client/src/lib/content/types';
import {COLORS} from '../../../../shared/src/constants/colors';
import {Display24} from '../../../../client/src/lib/components/Typography/Display/Display';
import {
  Body14,
  Body16,
} from '../../../../client/src/lib/components/Typography/Body/Body';
import {
  Spacer16,
  Spacer24,
  Spacer32,
  Spacer4,
  Spacer8,
} from '../../../../client/src/lib/components/Spacers/Spacer';
import CardGraphic from '../../../../client/src/lib/components/CardGraphic/CardGraphic';
import useGetSessionCardTags from '../../../../client/src/lib/components/Cards/SessionCard/hooks/useGetSessionCardTags';
import {SessionMode} from '../../../../shared/src/schemas/Session';
import Tag from '../../../../client/src/lib/components/Tag/Tag';
import {Fragment, use, useCallback} from 'react';
import Gutters from './Gutters';
import Link from 'next/link';
import {Heading16} from '../../../../client/src/lib/components/Typography/Heading/Heading';
import {
  CloseIcon,
  CommunityIcon,
  MeIcon,
} from '../../../../client/src/lib/components/Icons';
import {useTranslation} from 'react-i18next';
import Markdown from '../../../../client/src/lib/components/Typography/Markdown/Markdown';
import Button from '../../../../client/src/lib/components/Buttons/Button';
import {useRouter} from 'next/navigation';

const Background = styled.dialog.attrs({open: true})({
  position: 'fixed',
  left: 0,
  top: 0,
  right: 0,
  bottom: 0,
  display: 'flex',
  width: '100%',
  height: '100%',
  border: 'none',
  backdropFilter: 'blur(4px)',
  background: 'rgba(46, 46, 46, 0.50)',
  flexDirection: 'column',
  padding: '64px 0',
  alignItems: 'center',
  zIndex: 1,
  overflowY: 'auto',
  overflowBehavior: 'none',
});

const Modal = styled(Gutters)({
  position: 'relative',
  width: '100%',
  maxWidth: 795,
  background: COLORS.CREAM,
  borderRadius: 16,
  boxShadow: '-40px 50px 120px 0px rgba(0, 0, 0, 0.25)',
});

const Close = styled.div({
  position: 'absolute',
  top: 32,
  right: 32,
  width: 30,
  height: 30,
  cursor: 'pointer',
  zIndex: 1,
});

const About = styled.div({
  display: 'flex',
  flexDirection: 'row',
  alignItems: 'center',
  justifyContent: 'space-between',
});

const Graphic = styled.div({
  flexShrink: 0,
  width: 112,
  height: 112,
  margin: '30px 0',
});

const Tags = styled.div({
  display: 'flex',
  flexDirection: 'row',
  flexWrap: 'wrap',
  alignItems: 'center',
});

const Modes = styled.div({
  display: 'flex',
  flexDirection: 'row',
});

const Mode = styled(Link)({
  display: 'block',
  width: 110,
  height: 100,
  padding: '16px 12px',
  borderRadius: 16,
  background: COLORS.PURE_WHITE,
  textDecoration: 'none',
});

const ModeIcon = styled.div({
  width: 28,
  height: 28,
  marginBottom: 8,
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

const StartButton = styledNative(Button)({
  justifySelf: 'flex-start',
});

const ExerciseModal = ({
  exercise,
  onClose,
}: {
  exercise: ExerciseWithLanguage;
  onClose: () => void;
}) => {
  const {t} = useTranslation('Web.ExerciseModal');
  const tags = useGetSessionCardTags(exercise, SessionMode.async);
  const router = useRouter();

  const startSession = useCallback(() => {
    router.push(`/${exercise.language}/exercises/${exercise.id}`);
  }, [router, exercise]);

  return (
    <Background>
      <Modal>
        <Close onClick={onClose}>
          <CloseIcon />
        </Close>
        <Spacer32 />
        <About>
          <div>
            <Display24>{exercise.name}</Display24>
            <Spacer24 />
            <Markdown>{exercise.description}</Markdown>
          </div>
          <Spacer16 />
          <Graphic>
            <CardGraphic graphic={exercise.card} />
          </Graphic>
        </About>
        <Tags>
          {tags.map((tag, i) => (
            <Fragment key={i}>
              <Tag>{tag}</Tag>
              <Spacer4 />
            </Fragment>
          ))}
        </Tags>
        <Spacer16 />
        {!exercise.live ? (
          <StartButton variant="secondary" onPress={startSession}>
            {t('startCta')}
          </StartButton>
        ) : (
          <>
            <Heading16>{t('startHeading')}</Heading16>
            <Spacer8 />
            <Modes>
              {exercise.async && (
                <>
                  <Mode href={`/${exercise.language}/exercises/${exercise.id}`}>
                    <ModeIcon>
                      <MeIcon />
                    </ModeIcon>
                    <Body16>{t('mode.async')}</Body16>
                  </Mode>
                  <Spacer16 />
                </>
              )}
              {exercise.live && (
                <>
                  <Mode
                    href={`/${exercise.language}/exercises/${exercise.id}/host`}>
                    <ModeIcon>
                      <CommunityIcon />
                    </ModeIcon>
                    <Body16>{t('mode.live')}</Body16>
                  </Mode>
                  <Spacer16 />
                </>
              )}
            </Modes>
          </>
        )}
        {!!exercise?.coCreators?.length && (
          <>
            <Spacer32 />
            <Heading16>{t('coCreatorsHeading')}</Heading16>
            <CoCreators>
              {exercise.coCreators.map(coCreator => (
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
        <Spacer32 />
      </Modal>
    </Background>
  );
};

export default ExerciseModal;
