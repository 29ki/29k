import React, {useCallback, useContext, useEffect, useState} from 'react';
import {DailyEventObject} from '@daily-co/react-native-daily-js';
import Animated, {FadeInDown, FadeOut} from 'react-native-reanimated';
import {Body16} from '../../../common/components/Typography/Body/Body';
import {DailyContext} from '../DailyProvider';
import styled from 'styled-components/native';
import {COLORS} from '../../../../../shared/src/constants/colors';
import {View, ViewStyle} from 'react-native';
import {SPACINGS} from '../../../common/constants/spacings';
import {useTranslation} from 'react-i18next';

const Notification = styled(Body16)({
  backgroundColor: COLORS.WHITE_TRANSPARENT_70,
  padding: SPACINGS.EIGHT,
  marginTop: SPACINGS.EIGHT,
  borderRadius: SPACINGS.EIGHT,
  overflow: 'hidden',
});

const SessionNotification: React.FC<{text: string}> = ({text}) => {
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      setVisible(false);
    }, 3000);

    return () => {
      clearTimeout(timeoutId);
    };
  }, []);

  if (visible) {
    return (
      <Animated.View entering={FadeInDown} exiting={FadeOut}>
        <Notification>{text}</Notification>
      </Animated.View>
    );
  }

  return null;
};

const SessionNotifications: React.FC<{
  style?: ViewStyle;
}> = ({style}) => {
  const {call} = useContext(DailyContext);
  const {t} = useTranslation('Screen.Session');
  const [notifications, setNotifications] = useState<string[]>([]);

  const participantJoined = useCallback(
    (user: DailyEventObject<'participant-joined'> | undefined) => {
      setNotifications(state => [
        ...state,
        t('notifications.joined', {name: user?.participant.user_name}),
      ]);
    },
    [t],
  );

  const participantLeft = useCallback(
    (user: DailyEventObject<'participant-left'> | undefined) => {
      setNotifications(state => [
        ...state,
        t('notifications.left', {name: user?.participant.user_name}),
      ]);
    },
    [t],
  );

  useEffect(() => {
    call?.on('participant-joined', participantJoined);
    call?.on('participant-left', participantLeft);

    return () => {
      call?.off('participant-joined', participantJoined);
      call?.off('participant-left', participantLeft);
    };
  }, [call, participantJoined, participantLeft]);

  return (
    <View style={style} pointerEvents="none">
      {notifications.map((notification, i) => (
        <SessionNotification text={notification} key={i} />
      ))}
    </View>
  );
};

export default SessionNotifications;
