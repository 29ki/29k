import React, {Fragment, useCallback, useMemo} from 'react';
import {Share} from 'react-native';
import {useTranslation} from 'react-i18next';

import styled from 'styled-components/native';
import {COLORS} from '../../../../../../../shared/src/constants/colors';
import {
  SessionMode,
  SessionType,
} from '../../../../../../../shared/src/schemas/Session';
import Gutters from '../../../../../lib/components/Gutters/Gutters';
import {
  CommunityIcon,
  FriendsIcon,
  MeIcon,
  LogoIconAnimated,
  ShareIcon,
} from '../../../../../lib/components/Icons';
import {
  BottomSafeArea,
  Spacer12,
  Spacer16,
  Spacer24,
  Spacer28,
  Spacer4,
  Spacer8,
} from '../../../../../lib/components/Spacers/Spacer';
import TouchableOpacity from '../../../../../lib/components/TouchableOpacity/TouchableOpacity';
import {Body16} from '../../../../../lib/components/Typography/Body/Body';
import {Display24} from '../../../../../lib/components/Typography/Display/Display';
import {GUTTERS, SPACINGS} from '../../../../../lib/constants/spacings';
import {StepProps} from '../../CreateSessionModal';
import Button from '../../../../../lib/components/Buttons/Button';
import {useIsFocused, useNavigation} from '@react-navigation/native';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import useGetExerciseById from '../../../../../lib/content/hooks/useGetExerciseById';
import {formatContentName} from '../../../../../lib/utils/string';
import SessionCard from '../../../../../lib/components/Cards/SessionCard/SessionCard';
import {Heading16} from '../../../../../lib/components/Typography/Heading/Heading';
import {BottomSheetScrollView} from '@gorhom/bottom-sheet';
import {ModalStackProps} from '../../../../../lib/navigation/constants/routes';
import useStartAsyncSession from '../../../../../lib/session/hooks/useStartAsyncSession';
import Markdown from '../../../../../lib/components/Typography/Markdown/Markdown';
import useGetTagsById from '../../../../../lib/content/hooks/useGetTagsById';
import Tag from '../../../../../lib/components/Tag/Tag';
import IconButton from '../../../../../lib/components/Buttons/IconButton/IconButton';
import {ThumbsUpWithoutPadding} from '../../../../../lib/components/Thumbs/Thumbs';
import useExerciseRating from '../../../../../lib/session/hooks/useExerciseRating';
import useExerciseFeedback from '../../../../../lib/session/hooks/useExerciseFeedback';
import FeedbackCarousel from '../../../../../lib/components/FeedbackCarousel/FeedbackCarousel';
import useLiveSessionsByExercise from '../../../../../lib/session/hooks/useLiveSessionsByExercise';
import ExerciseCard from '../../../../../lib/components/Cards/SessionCard/ExerciseCard';
import useExercisesByTags from '../../../../../lib/content/hooks/useExercisesByTags';
import {Tag as TagType} from '../../../../../../../shared/src/types/generated/Tag';
import CoCreators from '../../../../../lib/components/CoCreators/CoCreators';
import ExerciseGraphic from '../../../../../lib/components/ExerciseGraphic/ExerciseGraphic';
import BackgroundBlock from '../../../../../lib/components/BackgroundBlock/BackgroundBlock';

const TypeItemWrapper = styled.View<{isLast?: boolean}>(({isLast}) => ({
  flexDirection: 'row',
  height: 96,
  flex: 1,
  marginRight: !isLast ? SPACINGS.SIXTEEN : undefined,
}));

const TextWrapper = styled.View({
  flex: 2,
  paddingVertical: SPACINGS.SIXTEEN,
});

const IconWrapper = styled.View({
  width: 30,
  height: 30,
});

const TypeWrapper = styled(TouchableOpacity)({
  justifyContent: 'center',
  height: 96,
  flex: 1,
  backgroundColor: COLORS.PURE_WHITE,
  borderRadius: SPACINGS.SIXTEEN,
  paddingHorizontal: SPACINGS.SIXTEEN,
});

const TypeItemHeading = styled(Heading16)({
  textAlign: 'left',
});

const Row = styled.View({
  flexDirection: 'row',
});

const SpaceBetweenRow = styled(Row)({
  alignItems: 'center',
  justifyContent: 'space-between',
});

const CenteredRow = styled(Row)({
  alignItems: 'center',
  justifyContent: 'center',
});

const VCenteredRow = styled(Row)({
  alignItems: 'center',
});

const LogoWrapper = styled.View({
  width: 90,
  height: 90,
});

const Graphic = styled(ExerciseGraphic)({
  width: 90,
  height: 90,
});

const RatingContainer = styled.View({
  position: 'absolute',
  flexDirection: 'row',
  alignItems: 'center',
  left: GUTTERS.SMALL,
});

const FeedbackThumb = styled(ThumbsUpWithoutPadding)({
  width: 24,
  height: 24,
});

const TypeItem: React.FC<{
  Icon: React.ReactNode;
  label: string;
  onPress: () => void;
}> = ({Icon, label, onPress = () => {}}) => (
  <TypeWrapper onPress={onPress}>
    <IconWrapper>{Icon}</IconWrapper>
    <Body16>{label}</Body16>
  </TypeWrapper>
);

const Tags = styled.View({
  flexWrap: 'wrap',
  flexDirection: 'row',
  alignItems: 'center',
  marginTop: -SPACINGS.FOUR,
});

const MORE_LIKE_THIS_LIMIT = 5;

const SelectTypeStep: React.FC<StepProps> = ({
  setSelectedModeAndType,
  nextStep,
  isPublicHost,
  selectedExercise,
}) => {
  const {t} = useTranslation('Modal.CreateSession');
  const {navigate, popToTop} =
    useNavigation<NativeStackNavigationProp<ModalStackProps>>();
  const getExerciseById = useGetExerciseById();
  const startSession = useStartAsyncSession();

  const {rating} = useExerciseRating(selectedExercise);
  const {feedback} = useExerciseFeedback(selectedExercise);
  const exercise = useMemo(
    () => (selectedExercise ? getExerciseById(selectedExercise) : null),
    [getExerciseById, selectedExercise],
  );

  const relatedExercises = useExercisesByTags(
    exercise?.tags as TagType[],
    exercise?.id,
    5,
  );

  const {sessions} = useLiveSessionsByExercise(exercise?.id && exercise, 5);
  const tags = useGetTagsById(exercise?.tags);

  const onJoinByInvite = useCallback(() => {
    popToTop();
    navigate('AddSessionByInviteModal');
  }, [popToTop, navigate]);

  const onTypePress = useCallback(
    (mode: SessionMode, type: SessionType) => () => {
      setSelectedModeAndType({mode, type});

      if (mode === SessionMode.async && selectedExercise) {
        popToTop();
        startSession(selectedExercise);
      } else {
        nextStep();
      }
    },
    [
      setSelectedModeAndType,
      nextStep,
      startSession,
      popToTop,
      selectedExercise,
    ],
  );

  const onShare = useCallback(() => {
    if (exercise?.link) {
      Share.share({
        message: exercise.link,
      });
    }
  }, [exercise?.link]);

  const onStartPress = useCallback(() => {
    if (selectedExercise) {
      popToTop();
      startSession(selectedExercise);
    }
  }, [startSession, popToTop, selectedExercise]);

  const typeSelection = useMemo(
    () => (
      <SpaceBetweenRow>
        {(!exercise || exercise.async) && (
          <TypeItemWrapper>
            <TypeItem
              onPress={onTypePress(SessionMode.async, SessionType.public)}
              label={t('selectType.async-public.title')}
              Icon={<MeIcon />}
            />
          </TypeItemWrapper>
        )}
        {(!exercise || exercise?.live) && (
          <TypeItemWrapper isLast={!isPublicHost}>
            <TypeItem
              onPress={onTypePress(SessionMode.live, SessionType.private)}
              label={t('selectType.live-private.title')}
              Icon={<FriendsIcon />}
            />
          </TypeItemWrapper>
        )}
        {isPublicHost && (!exercise || exercise?.live) && (
          <TypeItemWrapper isLast>
            <TypeItem
              onPress={onTypePress(SessionMode.live, SessionType.public)}
              label={t('selectType.live-public.title')}
              Icon={<CommunityIcon />}
            />
          </TypeItemWrapper>
        )}
      </SpaceBetweenRow>
    ),
    [exercise, isPublicHost, onTypePress, t],
  );

  if (exercise) {
    return (
      <BottomSheetScrollView focusHook={useIsFocused}>
        <Gutters>
          {rating && rating.positive > 0 ? (
            <RatingContainer>
              <FeedbackThumb />
              <Spacer4 />
              <Body16>{rating.positive}</Body16>
            </RatingContainer>
          ) : null}
          <Spacer12 />
          <SpaceBetweenRow>
            <TextWrapper>
              <Display24>{formatContentName(exercise)}</Display24>
            </TextWrapper>
            <Spacer16 />
            <Graphic graphic={exercise.card} />
          </SpaceBetweenRow>
          {exercise.description && (
            <>
              <Spacer16 />
              <Markdown>{exercise.description}</Markdown>
            </>
          )}
          {tags && (
            <Tags>
              {tags.map(({id, tag}) => (
                <Fragment key={id}>
                  <Tag>{tag}</Tag>
                  <Spacer4 />
                </Fragment>
              ))}
            </Tags>
          )}
          <Spacer16 />
          <VCenteredRow>
            {!exercise.live && (
              <>
                <Button variant="secondary" onPress={onStartPress}>
                  {t('startCta')}
                </Button>
                <Spacer12 />
              </>
            )}
            {exercise.link && (
              <>
                <IconButton
                  variant="secondary"
                  onPress={onShare}
                  Icon={ShareIcon}
                />
                <Spacer8 />
                <Body16>{t('shareHeading')}</Body16>
              </>
            )}
          </VCenteredRow>
          <Spacer24 />
          {exercise.live && (
            <>
              <TypeItemHeading>{t('typeHeading')}</TypeItemHeading>
              <Spacer8 />
              {typeSelection}
              <Spacer24 />
            </>
          )}
        </Gutters>
        {Boolean(sessions.length) && (
          <BackgroundBlock backgroundColor={COLORS.PURE_WHITE}>
            <Gutters>
              <Heading16>{t('orJoinUpcoming')}</Heading16>
              <Spacer8 />
              {sessions.map(item => (
                <Fragment key={item.id}>
                  <SessionCard
                    session={item}
                    small
                    onBeforeContextPress={popToTop}
                  />
                  <Spacer16 />
                </Fragment>
              ))}
              <Spacer8 />
            </Gutters>
          </BackgroundBlock>
        )}
        {Boolean(feedback?.length) && (
          <>
            <Gutters>
              <Heading16>{t('feedbackHeading')}</Heading16>
            </Gutters>
            <Spacer8 />
            <FeedbackCarousel feedbackItems={feedback} />
            <Spacer24 />
          </>
        )}
        {Boolean(relatedExercises?.length) && (
          <BackgroundBlock backgroundColor={COLORS.PURE_WHITE}>
            <Gutters>
              <Heading16>{t('moreLikeThis')}</Heading16>
              <Spacer8 />
              {relatedExercises.map(exerc => (
                <Fragment key={exerc.id}>
                  <ExerciseCard exercise={exerc} />
                  <Spacer16 />
                </Fragment>
              ))}
              <Spacer8 />
            </Gutters>
          </BackgroundBlock>
        )}
        {Boolean(exercise.coCreators?.length) && (
          <Gutters>
            <Heading16>{t('coCreatorsHeading')}</Heading16>
            <Spacer8 />
            <CoCreators coCreators={exercise.coCreators} />
            <Spacer24 />
          </Gutters>
        )}
        <BottomSafeArea minSize={SPACINGS.THIRTYTWO} />
      </BottomSheetScrollView>
    );
  }

  return (
    <Gutters>
      <Spacer8 />
      <SpaceBetweenRow>
        <TextWrapper>
          <Display24>{t('typeHeading')}</Display24>
        </TextWrapper>
        <Spacer16 />
        <LogoWrapper>
          <LogoIconAnimated />
        </LogoWrapper>
      </SpaceBetweenRow>
      <Spacer28 />
      {typeSelection}
      <Spacer16 />
      <CenteredRow>
        <Body16>{t('or')}</Body16>
      </CenteredRow>
      <Spacer16 />
      <CenteredRow>
        <Button variant="secondary" onPress={onJoinByInvite}>
          {t('joinByInviteCta')}
        </Button>
      </CenteredRow>
    </Gutters>
  );
};

export default SelectTypeStep;
