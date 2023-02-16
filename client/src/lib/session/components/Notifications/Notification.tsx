import React from 'react';
import Animated, {FadeInDown, FadeOut} from 'react-native-reanimated';
import styled from 'styled-components/native';

import {COLORS} from '../../../../../../shared/src/constants/colors';
import {SPACINGS} from '../../../constants/spacings';

import {Body16} from '../../../components/Typography/Body/Body';
import {Display22} from '../../../components/Typography/Display/Display';
import Image from '../../../components/Image/Image';
import {Notification as NotificationProps} from '../../state/state';

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

const Notification: React.FC<NotificationProps> = ({
  letter,
  text,
  Icon,
  image,
}) => (
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

export default React.memo(Notification);
