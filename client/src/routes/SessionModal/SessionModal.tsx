import {RouteProp, useNavigation, useRoute} from '@react-navigation/native';
import dayjs from 'dayjs';
import React from 'react';
import {useTranslation} from 'react-i18next';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {Platform, Share, View} from 'react-native';
import styled from 'styled-components/native';
import Button from '../../common/components/Buttons/Button';
import Gutters from '../../common/components/Gutters/Gutters';
import IconButton from '../../common/components/Buttons/IconButton/IconButton';
import {
  BellIcon,
  PrivateIcon,
  PublicIcon,
  ShareIcon,
} from '../../common/components/Icons';
import Image from '../../common/components/Image/Image';
import SheetModal from '../../common/components/Modals/SheetModal';
import {
  Spacer16,
  Spacer8,
  Spacer4,
} from '../../common/components/Spacers/Spacer';
import {Display24} from '../../common/components/Typography/Display/Display';
import {
  ModalStackProps,
  AppStackProps,
} from '../../lib/navigation/constants/routes';
import useExerciseById from '../../lib/content/hooks/useExerciseById';
import useAddToCalendar from '../Sessions/hooks/useAddToCalendar';
import useSessionNotificationReminder from '../Sessions/hooks/useSessionNotificationReminder';
import {Body14, Body16} from '../../common/components/Typography/Body/Body';
import Byline from '../../common/components/Bylines/Byline';
import {formatInviteCode} from '../../common/utils/string';
import * as metrics from '../../lib/metrics';
import CalendarIcon from '../../common/components/Icons/Calendar/Calendar';
import useSessionStartTime from '../Session/hooks/useSessionStartTime';
import Badge from '../../common/components/Badge/Badge';

const Content = styled(Gutters)({
  justifyContent: 'space-between',
});

const TopContent = styled(View)({
  flexDirection: 'row',
  justifyContent: 'space-between',
});

const ButtonsWrapper = styled(View)({
  flexDirection: 'row',
});

const Row = styled.View({
  flexDirection: 'row',
  alignItems: 'center',
});

const ImageContainer = styled.View({
  flex: 1,
  height: 80,
});

const SessionModal = () => {
  const {
    params: {session},
  } = useRoute<RouteProp<ModalStackProps, 'SessionModal'>>();
  const {t} = useTranslation('Modal.Session');
  const {t: sessionT} = useTranslation('Component.SessionCard');

  const navigation = useNavigation<NativeStackNavigationProp<AppStackProps>>();

  const addToCalendar = useAddToCalendar();
  const exercise = useExerciseById(session?.contentId);
  const {reminderEnabled, toggleReminder} =
    useSessionNotificationReminder(session);
  const sessionTime = useSessionStartTime(dayjs(session?.startTime));

  const startTime = dayjs(session.startTime);
  const startingNow = dayjs().isAfter(startTime.subtract(10, 'minutes'));

  if (!session || !exercise) {
    return null;
  }

  const onJoin = () => {
    navigation.popToTop();
    navigation.navigate('SessionStack', {
      screen: 'ChangingRoom',
      params: {
        sessionId: session.id,
      },
    });
    metrics.logEvent('Join Session', {
      'Session Exercise ID': session.contentId,
      'Session Language': session.language,
      'Session Type': session.type,
      'Session Start Time': session.startTime,
    });
  };

  const onAddToCalendar = () => {
    addToCalendar(
      exercise.name,
      session.link,
      startTime,
      startTime.add(30, 'minutes'),
    );
    metrics.logEvent('Add Session To Calendar', {
      'Session Exercise ID': session.contentId,
      'Session Language': session.language,
      'Session Type': session.type,
      'Session Start Time': session.startTime,
    });
  };

  const onToggleReminder = () => {
    toggleReminder(!reminderEnabled);
    if (!reminderEnabled) {
      metrics.logEvent('Add Session Reminder', {
        'Session Exercise ID': session.contentId,
        'Session Language': session.language,
        'Session Type': session.type,
        'Session Start Time': session.startTime,
      });
    }
  };

  const onShare = () => {
    if (session.link) {
      Share.share({
        url: session.link,
        message: t('shareMessage', {
          link: Platform.select({android: session.link, default: undefined}),
          code: formatInviteCode(session.inviteCode),
          interpolation: {escapeValue: false},
        }),
      });
    }
  };

  return (
    <SheetModal>
      <Spacer16 />
      <Content>
        <TopContent>
          <View>
            <Display24>{exercise?.name}</Display24>
            <Byline
              pictureURL={session.hostProfile?.photoURL}
              name={session.hostProfile?.displayName}
            />
          </View>
          <ImageContainer>
            <Image
              resizeMode="contain"
              source={{uri: exercise?.card?.image?.source}}
            />
          </ImageContainer>
        </TopContent>
        <Spacer8 />
        <Row>
          {!sessionTime.isReadyToJoin && (
            <>
              {sessionTime.isInLessThanAnHour ? (
                <Body14>{sessionT('counterLabel.startsIn')}</Body14>
              ) : (
                <Body14>{sessionT('counterLabel.starts')}</Body14>
              )}
              <Spacer4 />
            </>
          )}
          <Badge
            text={
              sessionTime.isStarted
                ? sessionT('counter.started')
                : sessionTime.time
            }
            Icon={session.type === 'private' ? <PrivateIcon /> : <PublicIcon />}
          />
        </Row>
      </Content>

      <Spacer16 />

      <Gutters>
        <Body16>{t('description')}</Body16>
        <Spacer16 />
        <ButtonsWrapper>
          {startingNow ? (
            <>
              <Button small variant="primary" onPress={onJoin}>
                {t('join')}
              </Button>
            </>
          ) : (
            <>
              <IconButton
                Icon={CalendarIcon}
                variant={'secondary'}
                onPress={onAddToCalendar}
              />
              <Spacer16 />
              <IconButton
                Icon={BellIcon}
                variant="secondary"
                active={reminderEnabled}
                onPress={onToggleReminder}
              />
            </>
          )}

          {session.link && (
            <>
              <Spacer16 />
              <Button
                variant="secondary"
                onPress={onShare}
                LeftIcon={ShareIcon}>
                {formatInviteCode(session.inviteCode)}
              </Button>
            </>
          )}
        </ButtonsWrapper>
      </Gutters>
    </SheetModal>
  );
};

export default SessionModal;
