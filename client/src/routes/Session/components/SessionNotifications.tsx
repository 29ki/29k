import React, {useCallback, useContext, useEffect, useState} from 'react';
import {DailyEventObject} from '@daily-co/react-native-daily-js';
import Animated, {FadeInDown, FadeOut} from 'react-native-reanimated';
import styled from 'styled-components/native';
import {useTranslation} from 'react-i18next';
import {View, ViewStyle} from 'react-native';

import {COLORS} from '../../../../../shared/src/constants/colors';
import {SPACINGS} from '../../../common/constants/spacings';
import {DailyContext} from '../DailyProvider';
import {Body16} from '../../../common/components/Typography/Body/Body';
import {Display22} from '../../../common/components/Typography/Display/Display';

const Notification = styled.View({
  backgroundColor: COLORS.WHITE_TRANSPARENT_80,
  padding: SPACINGS.EIGHT,
  marginTop: SPACINGS.EIGHT,
  borderRadius: SPACINGS.EIGHT,
  overflow: 'hidden',
  flexDirection: 'row',
  alignItem: 'center',
  justifyContent: 'center',
});
const ProfilePlaceholder = styled(Display22)({
  backgroundColor: COLORS.BLACK,
  width: 30,
  height: 30,
  paddingLeft: SPACINGS.EIGHT,
  overflow: 'hidden',
  borderRadius: 15,
  marginRight: SPACINGS.EIGHT,
  color: COLORS.WHITE,
});

const Name = styled(Body16)({
  paddingTop: SPACINGS.FOUR,
});

const SessionNotification: React.FC<{text: string; withProfile: boolean}> = ({
  withProfile,
  text,
}) => {
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      setVisible(false);
    }, 3000);

    return () => {
      clearTimeout(timeoutId);
    };
  }, []);

  if (!visible) {
    return (
      <Animated.View entering={FadeInDown} exiting={FadeOut}>
        <Notification>
          {withProfile && <ProfilePlaceholder>{text[0]}</ProfilePlaceholder>}
          <Name>{text}</Name>
        </Notification>
      </Animated.View>
    );
  }

  return null;
};

enum NotificationType {
  participant = 'participant',
  network = 'network',
}

type Notification = {
  type: NotificationType;
  text: string;
};

const SessionNotifications: React.FC<{
  style?: ViewStyle;
}> = ({style}) => {
  const {call} = useContext(DailyContext);
  const {t} = useTranslation('Screen.Session');
  const [notifications, setNotifications] = useState<Notification[]>([]);

  const participantJoined = useCallback(
    (user: DailyEventObject<'participant-joined'> | undefined) => {
      setNotifications(state => [
        ...state,
        {
          type: NotificationType.participant,
          text: t('notifications.joined', {name: user?.participant.user_name}),
        },
      ]);
    },
    [t],
  );

  const participantLeft = useCallback(
    (user: DailyEventObject<'participant-left'> | undefined) => {
      setNotifications(state => [
        ...state,
        {
          type: NotificationType.participant,
          text: t('notifications.left', {name: user?.participant.user_name}),
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
            type: NotificationType.network,
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

    return () => {
      call?.off('participant-joined', participantJoined);
      call?.off('participant-left', participantLeft);
      call?.off('network-quality-change', networkQualityChange);
    };
  }, [call, participantJoined, participantLeft, networkQualityChange]);

  return (
    <View style={style} pointerEvents="none">
      {notifications.map((notification, i) => (
        <SessionNotification
          text={notification.text}
          withProfile={notification.type === 'participant'}
          key={i}
        />
      ))}
    </View>
  );
};

export default SessionNotifications;
