import React from 'react';
import {ViewStyle} from 'react-native';
import styled from 'styled-components/native';

import Button, {ButtonText} from '../../../../common/components/Buttons/Button';
import {COLORS} from '../../../../common/constants/colors';
import {IconType} from '../../../../common/components/Icons';

type SlideButtonProps = {
  onPress?: () => void;
  Icon: IconType;
  disabled?: boolean;
  style?: ViewStyle;
  fill?: string;
  title: string;
  primary: boolean;
};

const StyledSlideButton = styled(Button)({
  backgroundColor: COLORS.GREY100,
  color: COLORS.BLACK_EASY,
});
const IconWrapper = styled.View({
  width: 26,
  height: 26,
});
const SlideButton: React.FC<SlideButtonProps> = ({
  onPress,
  fill = COLORS.BLACK_EASY,
  Icon,
  disabled = false,
  style,
  title = '',
  primary = false,
}) => (
  <StyledSlideButton
    primary
    onPress={onPress}
    disabled={disabled}
    style={style}>
    <ButtonText primary={primary}>{title}</ButtonText>
    <IconWrapper>
      <Icon fill={fill} />
    </IconWrapper>
  </StyledSlideButton>
);

export default SlideButton;
