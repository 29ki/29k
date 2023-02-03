import React from 'react';
import {COLORS} from '../../../../../../shared/src/constants/colors';
import IconButton, {
  IconButtonProps,
} from '../../../components/Buttons/IconButton/IconButton';

const NavButton: React.FC<IconButtonProps> = ({
  Icon,
  onPress,
  disabled,
  style,
}) => (
  <IconButton
    style={style}
    onPress={onPress}
    Icon={Icon}
    noBackground
    small
    fill={COLORS.BLACK}
    disabled={disabled}
  />
);

export default NavButton;
