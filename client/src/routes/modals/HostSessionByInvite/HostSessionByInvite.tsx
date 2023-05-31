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
import {Share, View} from 'react-native';
import {BottomSheetScrollView} from '@gorhom/bottom-sheet';
import styled from 'styled-components/native';

import Button from '../../../lib/components/Buttons/Button';
import Gutters from '../../../lib/components/Gutters/Gutters';
import IconButton from '../../../lib/components/Buttons/IconButton/IconButton';

import {
  ShareIcon,
  BellIconAnimated,
  PlusToCheckIconAnimated,
  PencilIcon,
  CalendarIcon,
} from '../../../lib/components/Icons';
import Image from '../../../lib/components/Image/Image';
import SheetModal from '../../../lib/components/Modals/SheetModal';

import {
  ModalStackProps,
  AppStackProps,
} from '../../../lib/navigation/constants/routes';

import useExerciseById from '../../../lib/content/hooks/useExerciseById';
import useAddSessionToCalendar from '../../../lib/sessions/hooks/useAddSessionToCalendar';
import useSessionReminderNotification from '../../../lib/sessions/hooks/useSessionReminderNotification';
import useUser from '../../../lib/user/hooks/useUser';

import {formatContentName, formatInviteCode} from '../../../lib/utils/string';

import {
  BottomSafeArea,
  Spacer16,
  Spacer32,
  Spacer4,
  Spacer8,
} from '../../../lib/components/Spacers/Spacer';
import {Display24} from '../../../lib/components/Typography/Display/Display';
import {Body16} from '../../../lib/components/Typography/Body/Body';
import Byline from '../../../lib/components/Bylines/Byline';

import SessionTimeBadge from '../../../lib/components/SessionTimeBadge/SessionTimeBadge';
import {COLORS} from '../../../../../shared/src/constants/colors';

import TouchableOpacity from '../../../lib/components/TouchableOpacity/TouchableOpacity';
import {SPACINGS} from '../../../lib/constants/spacings';
import useLogSessionMetricEvents from '../../../lib/sessions/hooks/useLogSessionMetricEvents';
import Markdown from '../../../lib/components/Typography/Markdown/Markdown';
import usePinSession from '../../../lib/sessions/hooks/usePinSession';
import useConfirmSessionReminder from '../../../lib/sessions/hooks/useConfirmSessionReminder';
import Tag from '../../../lib/components/Tag/Tag';
import Interested from '../../../lib/components/Interested/Interested';
import AnimatedButton from '../../../lib/components/Buttons/AnimatedButton';
import AnimatedIconButton from '../../../lib/components/Buttons/IconButton/AnimatedIconButton';
import useGetSessionCardTags from '../../../lib/components/Cards/SessionCard/hooks/useGetSessionCardTags';

const Content = styled(Gutters)({
  justifyContent: 'space-between',
});

const SpaceBetweenRow = styled(View)({
  flex: 1,
  flexDirection: 'row',
  justifyContent: 'space-between',
});

const Row = styled(View)({
  flexDirection: 'row',
  alignItems: 'flex-end',
});

const TitleContainer = styled.View({
  flex: 2,
});

const ImageContainer = styled(Image)({
  aspectRatio: '1',
  flex: 1,
  height: 90,
});

const EditButton = styled(TouchableOpacity)({
  flexDirection: 'row',
});

const EditIcon = styled(View)({
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
  const {params: {inviteCode} = {}} =
    useRoute<RouteProp<ModalStackProps, 'HostSessionByInvite'>>();

  const {t} = useTranslation('Modal.Session');
  const user = useUser();

  const initialStartTime = dayjs(session.startTime).utc();

  const {togglePinned, isPinned} = usePinSession(session);
  const logSessionMetricEvent = useLogSessionMetricEvents();

  const navigation =
    useNavigation<NativeStackNavigationProp<AppStackProps & ModalStackProps>>();

  const addToCalendar = useAddSessionToCalendar();
  const exercise = useExerciseById(session?.exerciseId);
  const tags = useGetSessionCardTags(exercise);
  const {reminderEnabled, toggleReminder} =
    useSessionReminderNotification(session);
  const confirmToggleReminder = useConfirmSessionReminder(session);

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
        dayjs(session.startTime).add(exercise.duration, 'minutes'),
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
      Share.share({
        message: t('shareMessage', {
          link: session.link,
          code: formatInviteCode(session.inviteCode),
          interpolation: {escapeValue: false},
        }),
      });
    }
  }, [session.link, session.inviteCode, t]);

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
    <SheetModal backgroundColor={COLORS.CREAM}>
      <BottomSheetScrollView focusHook={useIsFocused}>
        <Spacer16 />

        <Content>
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
            <ImageContainer
              resizeMode="contain"
              source={{uri: exercise?.card?.image?.source}}
            />
          </SpaceBetweenRow>
        </Content>
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
        <Spacer16 />

        <Gutters>
          <Row>
            {startingNow && (
              <>
                <Button small variant="secondary" onPress={onJoin}>
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
          <Spacer16 />

          {!isHost && (
            <>
              <JourneyButton
                small
                AnimatedIcon={PlusToCheckIconAnimated}
                fill={COLORS.WHITE}
                onPress={togglePinned}
                variant={isPinned ? 'primary' : 'secondary'}
                active={isPinned}>
                {t('journeyButton')}
              </JourneyButton>

              <Spacer32 />
            </>
          )}
        </Gutters>

        <Gutters>
          <Body16>{t('description')}</Body16>
          <Spacer16 />
          <Row>
            {!startingNow && (
              <>
                <IconButton
                  Icon={CalendarIcon}
                  variant={'secondary'}
                  onPress={onAddToCalendar}
                />
                <Spacer16 />
              </>
            )}

            {session.link && (
              <>
                <IconButton
                  variant="secondary"
                  onPress={onShare}
                  Icon={ShareIcon}
                />
              </>
            )}
            {(isPinned || isHost) && (
              <>
                <Spacer16 />
                <AnimatedIconButton
                  AnimatedIcon={BellIconAnimated}
                  fill={COLORS.WHITE}
                  variant={reminderEnabled ? 'primary' : 'secondary'}
                  active={reminderEnabled}
                  onPress={onToggleReminder}
                />
              </>
            )}
          </Row>
        </Gutters>
        <BottomSafeArea minSize={SPACINGS.THIRTYTWO} />
      </BottomSheetScrollView>
    </SheetModal>
  );
};

export default SessionModal;
