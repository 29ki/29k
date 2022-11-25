import {RouteProp, useNavigation, useRoute} from '@react-navigation/native';
import dayjs from 'dayjs';
import React from 'react';
import {useTranslation} from 'react-i18next';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {Alert, Platform, Share, View} from 'react-native';
import styled from 'styled-components/native';

import Button from '../../common/components/Buttons/Button';
import Gutters from '../../common/components/Gutters/Gutters';
import IconButton from '../../common/components/Buttons/IconButton/IconButton';
import {BellIcon, DeleteIcon, ShareIcon} from '../../common/components/Icons';
import Image from '../../common/components/Image/Image';
import SheetModal from '../../common/components/Modals/SheetModal';
import {
  Spacer16,
  Spacer32,
  Spacer4,
  Spacer8,
} from '../../common/components/Spacers/Spacer';
import {Display24} from '../../common/components/Typography/Display/Display';
import {
  ModalStackProps,
  AppStackProps,
} from '../../lib/navigation/constants/routes';
import useExerciseById from '../../lib/content/hooks/useExerciseById';
import useAddToCalendar from '../Sessions/hooks/useAddToCalendar';
import useSessionNotificationReminder from '../Sessions/hooks/useSessionNotificationReminder';
import {Body16} from '../../common/components/Typography/Body/Body';
import Byline from '../../common/components/Bylines/Byline';
import {formatInviteCode} from '../../common/utils/string';
import * as metrics from '../../lib/metrics';
import CalendarIcon from '../../common/components/Icons/Calendar/Calendar';
import SessionTimeBadge from '../../common/components/SessionTimeBadge/SessionTimeBadge';
import {COLORS} from '../../../../shared/src/constants/colors';
import useUser from '../../lib/user/hooks/useUser';
import useSessions from '../Sessions/hooks/useSessions';

const Content = styled(Gutters)({
  justifyContent: 'space-between',
});

const TopContent = styled(View)({
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

const DeleteButton = styled(IconButton)({
  backgroundColor: COLORS.DELETE,
});

const SessionModal = () => {
  const {
    params: {session},
  } = useRoute<RouteProp<ModalStackProps, 'SessionModal'>>();
  const {t} = useTranslation('Modal.Session');
  const user = useUser();
  const {deleteSession} = useSessions();
  const navigation = useNavigation<NativeStackNavigationProp<AppStackProps>>();

  const addToCalendar = useAddToCalendar();
  const exercise = useExerciseById(session?.contentId);
  const {reminderEnabled, toggleReminder} =
    useSessionNotificationReminder(session);

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

  const onDelete = () => {
    Alert.alert(t('delete.header'), t('delete.text'), [
      {text: t('delete.buttons.cancel'), style: 'cancel', onPress: () => {}},
      {
        text: t('delete.buttons.confirm'),
        style: 'destructive',

        onPress: async () => {
          await deleteSession(session.id);
          navigation.popToTop();
        },
      },
    ]);
  };

  return (
    <SheetModal>
      <Spacer16 />
      <Content>
        <TopContent>
          <TitleContainer>
            <Display24>{exercise?.name}</Display24>
            <Spacer4 />
            <Byline
              pictureURL={session.hostProfile?.photoURL}
              name={session.hostProfile?.displayName}
            />
          </TitleContainer>
          <Spacer32 />
          <ImageContainer
            resizeMode="contain"
            source={{uri: exercise?.card?.image?.source}}
          />
        </TopContent>
        <Spacer16 />
        <Row>
          {startingNow && (
            <>
              <Button small variant="secondary" onPress={onJoin}>
                {t('join')}
              </Button>
              <Spacer8 />
            </>
          )}
          <SessionTimeBadge session={session} />
        </Row>
      </Content>

      <Spacer16 />

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
              <IconButton
                Icon={BellIcon}
                variant="secondary"
                active={reminderEnabled}
                onPress={onToggleReminder}
              />
              <Spacer16 />
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
          {user?.uid === session?.hostId && (
            <>
              <Spacer16 />
              <DeleteButton small onPress={onDelete} Icon={DeleteIcon} />
            </>
          )}
        </Row>
      </Gutters>
    </SheetModal>
  );
};

export default SessionModal;
