import React, {useCallback, useContext, useEffect, useState} from 'react';
import {DailyEventObject} from '@daily-co/react-native-daily-js';
import {useTranslation} from 'react-i18next';
import {View, ViewStyle} from 'react-native';

import {DailyContext} from '../../../../lib/daily/DailyProvider';
import {DailyUserData} from '../../../../../../shared/src/types/Session';
import {Notification, NotificationProps} from './Notification';
import useMuteAudioListener from '../../hooks/useMuteAudioListener';

const SessionNotifications: React.FC<{
  style?: ViewStyle;
}> = ({style}) => {
  const {call} = useContext(DailyContext);
  const {t} = useTranslation('Screen.Session');
  const [notifications, setNotifications] = useState<NotificationProps[]>([]);

  const hostIsMuted = useCallback(() => {
    setNotifications(state => [
      ...state,
      {
        text: t('notifications.muted'),
      },
    ]);
  }, [t]);

  const participantJoined = useCallback(
    (event: DailyEventObject<'participant-joined'> | undefined) => {
      const image = (event?.participant.userData as DailyUserData)?.photoURL;
      const name = event?.participant.user_name ?? '';
      setNotifications(state => [
        ...state,
        {
          text: t('notifications.joined', {name}),
          letter: name[0],
          image,
        },
      ]);
    },
    [t],
  );

  const participantLeft = useCallback(
    (event: DailyEventObject<'participant-left'> | undefined) => {
      const image = (event?.participant.userData as DailyUserData)?.photoURL;
      const name = event?.participant.user_name ?? '';
      setNotifications(state => [
        ...state,
        {
          text: t('notifications.left', {name}),
          letter: name[0],
          image,
        },
      ]);
    },
    [t],
  );

  const networkQualityChange = useCallback(
    (event: DailyEventObject<'network-quality-change'> | undefined) => {
      if (['low', 'very-low'].includes(event?.threshold ?? '')) {
        setNotifications(state => [
          ...state,
          {
            text: t('notifications.networkQuality'),
          },
        ]);
      }
    },
    [t],
  );

  useEffect(() => {
    call?.on('participant-joined', participantJoined);
    call?.on('participant-left', participantLeft);
    call?.on('network-quality-change', networkQualityChange);
    // listen for the host mute?? hostIsMuted

    return () => {
      call?.off('participant-joined', participantJoined);
      call?.off('participant-left', participantLeft);
      call?.off('network-quality-change', networkQualityChange);
    };
  }, [
    call,
    participantJoined,
    participantLeft,
    networkQualityChange,
    hostIsMuted,
  ]);

  return (
    <View style={style} pointerEvents="none">
      {notifications.map((notification, i) => (
        <Notification
          text={notification.text}
          image={notification.image}
          letter={notification.letter}
          key={i}
          visible
        />
      ))}
    </View>
  );
};

export default SessionNotifications;
