import React from 'react';
import styled from 'styled-components/native';
import {COLORS} from '../../../constants/colors';
import {IconType} from '../../Icons';
import BaseButton, {BaseButtonProps} from '../BaseButton';

type BaseIconButtonProps = BaseButtonProps & {
  noBackground?: boolean;
};

const StyledIconButton = styled(BaseButton)<BaseIconButtonProps>(props => ({
  ...(props.noBackground ? {backgroundColor: 'transparent'} : {}),
  width: props.small ? 36 : 44,
  padding: props.small ? 3 : 7,
}));

type IconButtonProps = BaseIconButtonProps & {
  Icon: IconType;
};

const IconButton: React.FC<IconButtonProps> = ({
  onPress,
  variant,
  style,
  disabled,
  small,
  elevated,
  active,
  Icon,
  noBackground,
}) => (
  <StyledIconButton
    onPress={onPress}
    disabled={disabled}
    variant={variant}
    style={style}
    active={active}
    small={small}
    elevated={elevated}
    noBackground={noBackground}>
    <Icon
      fill={
        disabled || active || variant !== 'tertiary'
          ? COLORS.GREYLIGHTEST
          : COLORS.BLACK
      }
    />
  </StyledIconButton>
);

export default IconButton;
