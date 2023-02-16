import React, {useCallback, useContext, useEffect, useState} from 'react';
import {DailyEventObject} from '@daily-co/react-native-daily-js';
import {useTranslation} from 'react-i18next';
import {View, ViewStyle} from 'react-native';
import dayjs from 'dayjs';

import {DailyContext} from '../../../daily/DailyProvider';
import {DailyUserData} from '../../../../../../shared/src/types/Session';
import useLocalParticipant from '../../../daily/hooks/useLocalParticipant';
import TimedNotification from './TimedNotification';
import useSessionState from '../../state/state';
import useSessionSlideState from '../../hooks/useSessionSlideState';
import {MicrophoneOffIcon} from '../../../components/Icons';

const SessionNotifications: React.FC<{
  style?: ViewStyle;
}> = ({style}) => {
  const {call} = useContext(DailyContext);
  const {t} = useTranslation('Screen.Session');
  const localParticipant = useLocalParticipant();
  const notifications = useSessionState(state => state.notifications);
  const addNotification = useSessionState(state => state.addNotification);
  const sessionState = useSessionState(state => state.sessionState);
  const slideState = useSessionSlideState();
  const [muted, setWasMuted] = useState(Boolean(localParticipant?.audio));

  // State updates and events from daily comes in random order
  // Check if audio was muted and reset it after notifying
  useEffect(() => {
    if (
      muted &&
      sessionState?.playing &&
      slideState?.current.type !== 'sharing'
    ) {
      addNotification({
        text: t('notifications.muted'),
        Icon: MicrophoneOffIcon,
      });
      setWasMuted(false);
    }
  }, [
    t,
    addNotification,
    sessionState?.playing,
    slideState,
    muted,
    setWasMuted,
  ]);

  const trackStopped = useCallback(
    (event: DailyEventObject<'track-stopped'> | undefined) => {
      const participant = event?.participant;

      if (participant?.local && !participant.audio) {
        setWasMuted(true);
      }
    },
    [setWasMuted],
  );

  const participantJoined = useCallback(
    (event: DailyEventObject<'participant-joined'> | undefined) => {
      const image = (event?.participant.userData as DailyUserData)?.photoURL;
      const name = event?.participant.user_name ?? '';
      const localParticipantJoinedAt = dayjs.utc(localParticipant?.joined_at);
      const participantJoinedAt = dayjs.utc(event?.participant.joined_at);

      if (participantJoinedAt.isAfter(localParticipantJoinedAt)) {
        addNotification({
          text: t('notifications.joined', {name}),
          letter: name[0],
          image,
        });
      }
    },
    [t, addNotification, localParticipant?.joined_at],
  );

  const participantLeft = useCallback(
    (event: DailyEventObject<'participant-left'> | undefined) => {
      const image = (event?.participant.userData as DailyUserData)?.photoURL;
      const name = event?.participant.user_name ?? '';
      addNotification({
        text: t('notifications.left', {name}),
        letter: name[0],
        image,
      });
    },
    [t, addNotification],
  );

  const networkQualityChange = useCallback(
    (event: DailyEventObject<'network-quality-change'> | undefined) => {
      if (['low', 'very-low'].includes(event?.threshold ?? '')) {
        addNotification({
          text: t('notifications.networkQuality'),
        });
      }
    },
    [t, addNotification],
  );

  useEffect(() => {
    call?.on('participant-joined', participantJoined);
    call?.on('participant-left', participantLeft);
    call?.on('network-quality-change', networkQualityChange);
    call?.on('track-stopped', trackStopped);

    return () => {
      call?.off('participant-joined', participantJoined);
      call?.off('participant-left', participantLeft);
      call?.off('network-quality-change', networkQualityChange);
      call?.off('track-stopped', trackStopped);
    };
  }, [
    call,
    participantJoined,
    participantLeft,
    networkQualityChange,
    trackStopped,
  ]);

  return (
    <View style={style} pointerEvents="none">
      {notifications.map((notification, i) => (
        <TimedNotification
          text={notification.text}
          image={notification.image}
          letter={notification.letter}
          Icon={notification.Icon}
          key={i}
        />
      ))}
    </View>
  );
};

export default React.memo(SessionNotifications);
