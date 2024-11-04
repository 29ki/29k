import {
  RouteProp,
  useIsFocused,
  useNavigation,
  useRoute,
} from '@react-navigation/native';
import dayjs from 'dayjs';
import React, {Fragment, useCallback, useEffect} from 'react';
import {useTranslation} from 'react-i18next';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {Share} from 'react-native';
import styled from 'styled-components/native';

import {
  ModalStackProps,
  AppStackProps,
} from '../../../lib/navigation/constants/routes';

import {COLORS} from '../../../../../shared/src/constants/colors';
import {SPACINGS} from '../../../lib/constants/spacings';

import {formatContentName, formatInviteCode} from '../../../lib/utils/string';

import useGetSessionCardTags from '../../../lib/components/Cards/SessionCard/hooks/useGetSessionCardTags';
import useExerciseById from '../../../lib/content/hooks/useExerciseById';
import useAddSessionToCalendar from '../../../lib/sessions/hooks/useAddSessionToCalendar';
import useUser from '../../../lib/user/hooks/useUser';
import useSessionReminder from '../../../lib/sessions/hooks/useSessionReminder';
import useLogSessionMetricEvents from '../../../lib/sessions/hooks/useLogSessionMetricEvents';
import usePinSession from '../../../lib/sessions/hooks/usePinSession';
import useConfirmSessionReminder from '../../../lib/sessions/hooks/useConfirmSessionReminder';
import useExerciseRating from '../../../lib/session/hooks/useExerciseRating';

import Button from '../../../lib/components/Buttons/Button';
import Gutters from '../../../lib/components/Gutters/Gutters';
import IconButton from '../../../lib/components/Buttons/IconButton/IconButton';
import {Display24} from '../../../lib/components/Typography/Display/Display';
import {Heading16} from '../../../lib/components/Typography/Heading/Heading';
import {Body16} from '../../../lib/components/Typography/Body/Body';
import Byline from '../../../lib/components/Bylines/Byline';
import SessionTimeBadge from '../../../lib/components/SessionTimeBadge/SessionTimeBadge';
import TouchableOpacity from '../../../lib/components/TouchableOpacity/TouchableOpacity';
import Markdown from '../../../lib/components/Typography/Markdown/Markdown';
import Tag from '../../../lib/components/Tag/Tag';
import Interested from '../../../lib/components/Interested/Interested';
import AnimatedButton from '../../../lib/components/Buttons/AnimatedButton';
import AnimatedIconButton from '../../../lib/components/Buttons/IconButton/AnimatedIconButton';
import {
  ShareIcon,
  BellIconAnimated,
  PlusToCheckIconAnimated,
  PencilIcon,
  CalendarIcon,
} from '../../../lib/components/Icons';
import {
  BottomSafeArea,
  Spacer12,
  Spacer16,
  Spacer24,
  Spacer32,
  Spacer4,
  Spacer8,
} from '../../../lib/components/Spacers/Spacer';
import ActionList from '../../../lib/components/ActionList/ActionList';
import ActionButton from '../../../lib/components/ActionList/ActionItems/ActionButton';
import MagicIcon from '../../../lib/components/Icons/Magic/Magic';
import {
  ThumbsDownWithoutPadding,
  ThumbsUpWithoutPadding,
} from '../../../lib/components/Thumbs/Thumbs';
import useExerciseFeedback from '../../../lib/session/hooks/useExerciseFeedback';
import FeedbackCarousel from '../../../lib/components/FeedbackCarousel/FeedbackCarousel';
import useExercisesByTags from '../../../lib/content/hooks/useExercisesByTags';
import ExerciseCard from '../../../lib/components/Cards/SessionCard/ExerciseCard';
import CoCreators from '../../../lib/components/CoCreators/CoCreators';
import CardGraphic from '../../../lib/components/CardGraphic/CardGraphic';
import BackgroundBlock from '../../../lib/components/BackgroundBlock/BackgroundBlock';
import SheetModal from '../../../lib/components/Modals/SheetModal';
import {BottomSheetScrollView} from '@gorhom/bottom-sheet';
import {SessionMode} from '../../../../../shared/src/schemas/Session';
import useShareFromModal from '../../../lib/navigation/hooks/useShareFromModal';

const Content = styled(Gutters)({
  justifyContent: 'space-between',
});

const SpaceBetweenRow = styled.View({
  flexGrow: 1,
  flexDirection: 'row',
  justifyContent: 'space-between',
});

const Row = styled.View({
  flexDirection: 'row',
  alignItems: 'flex-end',
});

const RatingContainer = styled(Gutters)({
  position: 'absolute',
  flexDirection: 'row',
  alignItems: 'center',
});

const FeedbackThumbsUp = styled(ThumbsUpWithoutPadding)({
  width: 24,
  height: 24,
});
const FeedbackThumbsDown = styled(ThumbsDownWithoutPadding)({
  width: 24,
  height: 24,
});

const TitleContainer = styled.View({
  flex: 2,
  justifyContent: 'center',
});

const Graphic = styled(CardGraphic)({
  flex: 1,
});

const EditButton = styled(TouchableOpacity)({
  flexDirection: 'row',
});

const EditIcon = styled.View({
  width: 22,
  height: 22,
  alignSelf: 'center',
});

const JourneyButton = styled(AnimatedButton)({
  alignSelf: 'flex-start',
});

const Tags = styled(Gutters)({
  flexWrap: 'wrap',
  flexDirection: 'row',
  alignItems: 'center',
  marginTop: -SPACINGS.FOUR,
});

const SessionModal = () => {
  const {
    params: {session},
  } = useRoute<RouteProp<ModalStackProps, 'SessionModal'>>();

  const {t} = useTranslation('Modal.Session');
  const user = useUser();

  const initialStartTime = dayjs(session.startTime).utc();

  const {togglePinned, isPinned} = usePinSession(session);
  const logSessionMetricEvent = useLogSessionMetricEvents();

  const navigation =
    useNavigation<NativeStackNavigationProp<AppStackProps & ModalStackProps>>();

  const share = useShareFromModal();
  const addToCalendar = useAddSessionToCalendar();
  const exercise = useExerciseById(session.exerciseId, session.language);
  const tags = useGetSessionCardTags(exercise, SessionMode.live);
  const {rating} = useExerciseRating(session.exerciseId);
  const {feedback} = useExerciseFeedback(session.exerciseId);
  const {reminderEnabled, toggleReminder} = useSessionReminder(session);
  const confirmToggleReminder = useConfirmSessionReminder(session);
  const relatedExercises = useExercisesByTags(exercise?.tags, exercise?.id, 5);

  const startingNow = dayjs
    .utc()
    .isAfter(initialStartTime.subtract(10, 'minutes'));

  const isHost = user?.uid === session.hostId;

  const onJoin = useCallback(() => {
    logSessionMetricEvent('Join Sharing Session', session); // Log before navigating for correct Origin property in event
    navigation.popToTop();
    navigation.navigate('LiveSessionStack', {
      screen: 'ChangingRoom',
      params: {
        session: session,
      },
    });
  }, [navigation, session, logSessionMetricEvent]);

  const onAddToCalendar = useCallback(() => {
    if (session && exercise) {
      addToCalendar(
        exercise.name,
        session.hostProfile?.displayName,
        session.link,
        dayjs(session.startTime),
        dayjs(session.startTime).add(exercise.liveDuration, 'minutes'),
      );
      logSessionMetricEvent('Add Sharing Session To Calendar', session);
    }
  }, [addToCalendar, exercise, session, logSessionMetricEvent]);

  const onToggleReminder = useCallback(() => {
    toggleReminder(!reminderEnabled);
    if (!reminderEnabled) {
      logSessionMetricEvent('Add Sharing Session Reminder', session);
    }
  }, [reminderEnabled, toggleReminder, session, logSessionMetricEvent]);

  const onShare = useCallback(() => {
    if (session.link) {
      share({
        message: session.link,
      });
    }
  }, [session.link, share]);

  const onHostPress = useCallback(() => {
    navigation.popToTop();
    navigation.navigate('HostInfoModal', {host: session.hostProfile});
  }, [navigation, session.hostProfile]);

  const onEditMode = useCallback(
    () => navigation.navigate('EditSessionDateModal', {session}),
    [session, navigation],
  );
  const onEditHostMode = useCallback(
    () => navigation.navigate('AssignNewHostModal', {session}),
    [session, navigation],
  );
  const howItWorksPress = useCallback(
    () => navigation.navigate('HowItWorksModal'),
    [navigation],
  );

  useEffect(() => {
    if (isHost) {
      // Allways try to set / update reminders for hosts
      confirmToggleReminder(true);
    }
  }, [isHost, confirmToggleReminder]);

  if (!session || !exercise) {
    return null;
  }

  return (
    <SheetModal>
      <BottomSheetScrollView focusHook={useIsFocused}>
        <Content>
          {rating && rating.positive > 0 ? (
            <RatingContainer>
              <FeedbackThumbsUp />
              <Spacer4 />
              <Body16>{rating.positive}</Body16>
              <Spacer4 />
              <FeedbackThumbsDown />
              <Spacer4 />
              <Body16>{rating.negative}</Body16>
            </RatingContainer>
          ) : null}
          <Spacer16 />
          <SpaceBetweenRow>
            <TitleContainer>
              <Display24>{formatContentName(exercise)}</Display24>
              <Spacer4 />
              <Row>
                <Byline
                  pictureURL={session.hostProfile?.photoURL}
                  name={session.hostProfile?.displayName}
                  onPress={onHostPress}
                />
                {isHost && (
                  <EditButton onPress={onEditHostMode}>
                    <EditIcon>
                      <PencilIcon />
                    </EditIcon>
                  </EditButton>
                )}
              </Row>
            </TitleContainer>
            <Spacer32 />
            <Graphic graphic={exercise.card} />
          </SpaceBetweenRow>
          <Spacer8 />
        </Content>
        <Gutters>
          <Row>
            {startingNow && (
              <>
                <Button size="small" variant="secondary" onPress={onJoin}>
                  {t('join')}
                </Button>
                <Spacer8 />
              </>
            )}
            {isHost ? (
              <SpaceBetweenRow>
                <EditButton onPress={onEditMode}>
                  <SessionTimeBadge session={session} />
                  <EditIcon>
                    <PencilIcon />
                  </EditIcon>
                </EditButton>
                <Interested count={session.interestedCount} />
              </SpaceBetweenRow>
            ) : (
              <SessionTimeBadge session={session} />
            )}
          </Row>
          <Spacer8 />
        </Gutters>
        {exercise?.description && (
          <>
            <Spacer16 />
            <Gutters>
              <Markdown>{exercise?.description}</Markdown>
            </Gutters>
          </>
        )}

        {tags && (
          <Tags>
            {tags.map((tag, idx) => (
              <Fragment key={`tag-${idx}`}>
                <Tag>{tag}</Tag>
                <Spacer4 />
              </Fragment>
            ))}
          </Tags>
        )}
        <Spacer24 />
        <Gutters>
          <Row>
            {!isHost && !startingNow && (
              <>
                <JourneyButton
                  AnimatedIcon={PlusToCheckIconAnimated}
                  fill={COLORS.WHITE}
                  onPress={togglePinned}
                  variant={isPinned ? 'primary' : 'secondary'}
                  active={isPinned}>
                  {t('journeyButton')}
                </JourneyButton>
                <Spacer12 />
              </>
            )}

            {(isPinned || isHost) && !startingNow && (
              <>
                <AnimatedIconButton
                  AnimatedIcon={BellIconAnimated}
                  fill={COLORS.WHITE}
                  variant={reminderEnabled ? 'primary' : 'secondary'}
                  active={reminderEnabled}
                  onPress={onToggleReminder}
                />
                <Spacer12 />
              </>
            )}

            {!startingNow && (
              <>
                <IconButton
                  Icon={CalendarIcon}
                  variant={'secondary'}
                  onPress={onAddToCalendar}
                />
                <Spacer12 />
              </>
            )}

            {session.link && (
              <>
                <Button
                  variant="secondary"
                  onPress={onShare}
                  LeftIcon={ShareIcon}>
                  {formatInviteCode(session.inviteCode)}
                </Button>
              </>
            )}
          </Row>
          <Spacer24 />
          <ActionList>
            <ActionButton Icon={MagicIcon} onPress={howItWorksPress}>
              {t('howItWorks')}
            </ActionButton>
          </ActionList>
          <Spacer24 />
        </Gutters>
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
                  <ExerciseCard exercise={exerc} small />
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
    </SheetModal>
  );
};

export default SessionModal;
