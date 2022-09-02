import React from 'react';
import styled from 'styled-components/native';

import Button, {ButtonText} from '../../../../common/components/Buttons/Button';
import {COLORS} from '../../../../common/constants/colors';
import {IconType} from '../../../../common/components/Icons';

type SlideButtonProps = {
  onPress?: () => void;
  LeftIcon?: IconType;
  RightIcon?: IconType;
  disabled?: boolean;
  fill?: string;
};

const StyledSlideButton = styled(Button)({
  backgroundColor: COLORS.GREY100,
  color: COLORS.BLACK_EASY,
});

const IconWrapper = styled.View<{left?: boolean}>(props => ({
  width: 26,
  height: 26,
  marginLeft: props.left ? -8 : 0,
  marginRight: !props.left ? -8 : 0,
}));

const SlideButton: React.FC<SlideButtonProps> = ({
  onPress,
  fill = COLORS.BLACK_EASY,
  LeftIcon,
  RightIcon,
  disabled = false,
  children,
}) => (
  <StyledSlideButton primary onPress={onPress} disabled={disabled}>
    {LeftIcon && (
      <IconWrapper left>
        <LeftIcon fill={fill} />
      </IconWrapper>
    )}
    <ButtonText primary>{children}</ButtonText>
    {RightIcon && (
      <IconWrapper>
        <RightIcon fill={fill} />
      </IconWrapper>
    )}
  </StyledSlideButton>
);

export default SlideButton;
