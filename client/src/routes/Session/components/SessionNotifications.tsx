import React, {useCallback, useContext, useEffect, useState} from 'react';
import {DailyEventObject} from '@daily-co/react-native-daily-js';
import Animated, {FadeInDown, FadeOut} from 'react-native-reanimated';
import styled from 'styled-components/native';
import {useTranslation} from 'react-i18next';
import {View, ViewStyle} from 'react-native';

import {COLORS} from '../../../../../shared/src/constants/colors';
import {SPACINGS} from '../../../common/constants/spacings';

import {Body16} from '../../../common/components/Typography/Body/Body';
import {Display22} from '../../../common/components/Typography/Display/Display';
import {DailyContext} from '../../../lib/daily/DailyProvider';
import {DailyUserData} from '../../../../../shared/src/types/Session';
import Image from '../../../common/components/Image/Image';

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
const ProfilePlaceholder = styled.View({
  backgroundColor: COLORS.BLACK,
  width: 30,
  height: 30,
  overflow: 'hidden',
  borderRadius: 15,
  marginRight: SPACINGS.EIGHT,
  color: COLORS.WHITE,
  justifyContent: 'center',
  alignItems: 'center',
});

const Name = styled(Body16)({
  paddingTop: SPACINGS.FOUR,
});

const ProfileImage = styled(Image)({
  width: '100%',
  height: '100%',
});

const SessionNotification: React.FC<{
  text: string;
  letter?: string;
  image?: string;
}> = ({letter, text, image}) => {
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
        <Notification>
          {(letter || image) && (
            <ProfilePlaceholder>
              {image ? (
                <ProfileImage source={{uri: image}} />
              ) : (
                <Display22>{letter}</Display22>
              )}
            </ProfilePlaceholder>
          )}
          <Name>{text}</Name>
        </Notification>
      </Animated.View>
    );
  }

  return null;
};

type Notification = {
  text: string;
  letter?: string;
  image?: string;
};

const SessionNotifications: React.FC<{
  style?: ViewStyle;
}> = ({style}) => {
  const {call} = useContext(DailyContext);
  const {t} = useTranslation('Screen.Session');
  const [notifications, setNotifications] = useState<Notification[]>([]);

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
          image={notification.image}
          letter={notification.letter}
          key={i}
        />
      ))}
    </View>
  );
};

export default SessionNotifications;
