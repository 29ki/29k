import React, {useCallback, useContext, useEffect} from 'react';
import {DailyEventObject} from '@daily-co/react-native-daily-js';
import {useTranslation} from 'react-i18next';
import {View, ViewStyle} from 'react-native';
import dayjs from 'dayjs';

import {DailyContext} from '../../../../lib/daily/DailyProvider';
import {DailyUserData} from '../../../../../../shared/src/types/Session';
import {Notification} from './Notification';
import useSessionNotificationsState from '../../state/sessionNotificationsState';
import useLocalParticipant from '../../../../lib/daily/hooks/useLocalParticipant';

const SessionNotifications: React.FC<{
  style?: ViewStyle;
}> = ({style}) => {
  const {call} = useContext(DailyContext);
  const {t} = useTranslation('Screen.Session');
  const localParticipant = useLocalParticipant();
  const notifications = useSessionNotificationsState(
    state => state.notifications,
  );
  const addNotification = useSessionNotificationsState(
    state => state.addNotification,
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

    return () => {
      call?.off('participant-joined', participantJoined);
      call?.off('participant-left', participantLeft);
      call?.off('network-quality-change', networkQualityChange);
    };
  }, [call, participantJoined, participantLeft, networkQualityChange]);

  return (
    <View style={style} pointerEvents="none">
      {notifications.map((notification, i) => (
        <Notification
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

export default SessionNotifications;
