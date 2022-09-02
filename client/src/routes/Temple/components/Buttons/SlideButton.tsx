import React from 'react';
import styled from 'styled-components/native';

import Button from '../../../../common/components/Buttons/Button';
import {COLORS} from '../../../../common/constants/colors';
import {IconType} from '../../../../common/components/Icons';
import {B2} from '../../../../common/components/Typography/Text/Text';
import {SPACINGS} from '../../../../common/constants/spacings';

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
  paddingHorizontal: SPACINGS.EIGHT,
  boxShadow: '0px 4px 12px rgba(0, 0, 0, 0.16)',
  elevation: 1,
});

const IconWrapper = styled.View({
  width: 26,
  height: 26,
});

const ButtonText = styled(B2)({
  marginVertical: SPACINGS.TWELVE,
  marginHorizontal: SPACINGS.EIGHT,
});

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
      <IconWrapper>
        <LeftIcon fill={fill} />
      </IconWrapper>
    )}
    <ButtonText>{children}</ButtonText>
    {RightIcon && (
      <IconWrapper>
        <RightIcon fill={fill} />
      </IconWrapper>
    )}
  </StyledSlideButton>
);

export default SlideButton;
