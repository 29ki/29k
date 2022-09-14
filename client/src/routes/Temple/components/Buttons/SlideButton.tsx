import React from 'react';
import styled from 'styled-components/native';

import {COLORS} from '../../../../common/constants/colors';
import {IconType} from '../../../../common/components/Icons';
import {SPACINGS} from '../../../../common/constants/spacings';
import IconButton from '../../../../common/components/Buttons/IconButton/IconButton';

type SlideButtonProps = {
  onPress?: () => void;
  Icon: IconType;
  disabled?: boolean;
  fill?: string;
};

const StyledSlideButton = styled(IconButton)({
  backgroundColor: COLORS.GREY100,
  color: COLORS.BLACK_EASY,
  paddingVertical: SPACINGS.EIGHT,
  paddingHorizontal: SPACINGS.TWELVE,
  boxShadow: '0px 4px 12px rgba(0, 0, 0, 0.16)',
  elevation: 1,
});

const SlideButton: React.FC<SlideButtonProps> = ({
  onPress,
  fill = COLORS.BLACK_EASY,
  Icon,
  disabled = false,
}) => (
  <StyledSlideButton
    Icon={Icon}
    fill={fill}
    onPress={onPress}
    disabled={disabled}
  />
);

export default SlideButton;
