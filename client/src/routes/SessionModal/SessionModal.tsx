import {RouteProp, useNavigation, useRoute} from '@react-navigation/native';
import dayjs from 'dayjs';
import React, {useState} from 'react';
import {useTranslation} from 'react-i18next';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {Alert, Platform, Share, View} from 'react-native';
import styled from 'styled-components/native';

import Button from '../../common/components/Buttons/Button';
import Gutters from '../../common/components/Gutters/Gutters';
import IconButton from '../../common/components/Buttons/IconButton/IconButton';
import {BellIcon, ShareIcon} from '../../common/components/Icons';
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
import SessionTimeBadge from '../../common/components/SessionTimeBadge/SessionTimeBadge';
import {COLORS} from '../../../../shared/src/constants/colors';
import useUser from '../../lib/user/hooks/useUser';
import useSessions from '../Sessions/hooks/useSessions';
import {PencilIcon, CalendarIcon} from '../../common/components/Icons';
import TouchableOpacity from '../../common/components/TouchableOpacity/TouchableOpacity';
import DateTimePicker from '../CreateSessionModal/components/DateTimePicker';
import {updateSession} from '../Sessions/api/session';
import {Session} from '../../../../shared/src/types/Session';

const Content = styled(Gutters)({
  justifyContent: 'space-between',
});

const SpaceBetweenRow = styled(View)({
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

const DeleteButton = styled(Button)({
  backgroundColor: COLORS.DELETE,
});

const SessionModal = () => {
  const {
    params: {session: initialSessionData},
  } = useRoute<RouteProp<ModalStackProps, 'SessionModal'>>();

  const {t} = useTranslation('Modal.Session');
  const user = useUser();
  const {deleteSession, fetchSessions} = useSessions();
  const [editMode, setEditMode] = useState(false);

  const [session, setSession] = useState<Session>(initialSessionData);
  const initialStartTime = dayjs(session.startTime).utc();
  const [sessionDate, setSessionDate] = useState<dayjs.Dayjs>(initialStartTime);
  const [sessionTime, setSessionTime] = useState<dayjs.Dayjs>(initialStartTime);

  const navigation = useNavigation<NativeStackNavigationProp<AppStackProps>>();

  const addToCalendar = useAddToCalendar();
  const exercise = useExerciseById(session?.contentId);
  const {reminderEnabled, toggleReminder} =
    useSessionNotificationReminder(session);

  const startingNow = dayjs
    .utc()
    .isAfter(initialStartTime.subtract(10, 'minutes'));

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
      dayjs(session.startTime),
      dayjs(session.startTime).add(30, 'minutes'),
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
        message: t('shareMessage', {
          link: session.link,
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
        <SpaceBetweenRow>
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
        </SpaceBetweenRow>
      </Content>
      <Spacer8 />
      {!editMode && (
        <>
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
              {user?.uid === session.hostId && (
                <EditButton onPress={() => setEditMode(true)}>
                  <SessionTimeBadge session={session} />
                  <EditIcon>
                    <PencilIcon />
                  </EditIcon>
                </EditButton>
              )}
              {user?.uid !== session.hostId && (
                <SessionTimeBadge session={session} />
              )}
            </Row>
          </Gutters>

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
            </Row>
          </Gutters>
        </>
      )}
      {editMode && (
        <Gutters>
          <DateTimePicker
            initialDateTime={initialStartTime}
            minimumDate={dayjs().local()}
            onChange={(date, time) => {
              setSessionDate(date);
              setSessionTime(time);
            }}
          />
          <Spacer16 />
          <SpaceBetweenRow>
            <Button
              variant="secondary"
              onPress={async () => {
                const sessionDateTime = sessionDate
                  .hour(sessionTime.hour())
                  .minute(sessionTime.minute());

                const updatedSession = await updateSession(session.id, {
                  startTime: sessionDateTime.utc().toISOString(),
                });

                setSession(updatedSession);
                fetchSessions();
                setEditMode(false);
              }}>
              {t('done')}
            </Button>
            <DeleteButton small onPress={onDelete}>
              {t('deleteButton')}
            </DeleteButton>
          </SpaceBetweenRow>
        </Gutters>
      )}
    </SheetModal>
  );
};

export default SessionModal;
