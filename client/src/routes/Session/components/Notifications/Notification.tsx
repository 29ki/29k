import React, {useEffect, useState} from 'react';
import Animated, {FadeInDown, FadeOut} from 'react-native-reanimated';
import styled from 'styled-components/native';

import {COLORS} from '../../../../../../shared/src/constants/colors';
import {SPACINGS} from '../../../../common/constants/spacings';

import {Body16} from '../../../../common/components/Typography/Body/Body';
import {Display22} from '../../../../common/components/Typography/Display/Display';
import Image from '../../../../common/components/Image/Image';
import {NotificationProps} from '../../state/sessionNotificationsState';

const Wrapper = styled.View({
  backgroundColor: COLORS.WHITE_TRANSPARENT_80,
  padding: SPACINGS.EIGHT,
  marginTop: SPACINGS.EIGHT,
  borderRadius: SPACINGS.EIGHT,
  overflow: 'hidden',
  flexDirection: 'row',
  alignItems: 'center',
});
const ProfilePlaceholder = styled.View({
  backgroundColor: COLORS.BLACK,
  width: 30,
  height: 30,
  overflow: 'hidden',
  borderRadius: 15,
  marginRight: SPACINGS.EIGHT,
  justifyContent: 'center',
  alignItems: 'center',
});
const Letter = styled(Display22)({
  color: COLORS.WHITE,
  lineHeight: 26,
});

const IconWrapper = styled.View({
  width: 21,
  height: 21,
  alignItems: 'center',
  justifyContent: 'center',
});

const ProfileImage = styled(Image)({
  width: '100%',
  height: '100%',
});

export const Notification: React.FC<NotificationProps> = ({
  letter,
  text,
  Icon,
  image,
  timeVisible,
  visible,
}) => {
  const [active, setActive] = useState(true);

  useEffect(() => {
    if (!visible) {
      const timeoutId = setTimeout(() => {
        setActive(false);
      }, timeVisible ?? 3000);

      return () => {
        clearTimeout(timeoutId);
      };
    }
  }, [visible, timeVisible]);

  if (active) {
    return (
      <Animated.View entering={FadeInDown} exiting={FadeOut}>
        <Wrapper>
          {(letter || image) && (
            <ProfilePlaceholder>
              {image ? (
                <ProfileImage source={{uri: image}} />
              ) : (
                <Letter>{letter?.toUpperCase()}</Letter>
              )}
            </ProfilePlaceholder>
          )}
          {Icon && (
            <IconWrapper>
              <Icon />
            </IconWrapper>
          )}
          <Body16>{text}</Body16>
        </Wrapper>
      </Animated.View>
    );
  }

  return null;
};

export default Notification;
