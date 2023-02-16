import React from 'react';
import {ActivityIndicator} from 'react-native';
import styled from 'styled-components/native';
import {COLORS} from '../../../../../../shared/src/constants/colors';
import {SPACINGS} from '../../../constants/spacings';
import {IconType} from '../../Icons';
import BaseButton, {BaseButtonProps} from '../BaseButton';

export type BaseIconButtonProps = BaseButtonProps & {
  noBackground?: boolean;
  fill?: string;
};

const StyledIconButton = styled(BaseButton)<BaseIconButtonProps>(props => ({
  ...(props.noBackground ? {backgroundColor: 'transparent'} : {}),
  width: props.small ? 36 : 44,
  height: props.small ? 36 : 44,
  padding: props.small ? 3 : 7,
  borderRadius: SPACINGS.SIXTEEN,
}));

export type IconButtonProps = BaseIconButtonProps & {
  Icon: IconType;
  loading?: boolean;
};

const IconButton: React.FC<IconButtonProps> = ({
  onPress,
  variant,
  style,
  disabled,
  small,
  elevated,
  active,
  loading,
  Icon,
  noBackground,
  fill,
}) => (
  <StyledIconButton
    hitSlop={
      small
        ? {
            bottom: SPACINGS.FOUR,
            left: SPACINGS.FOUR,
            right: SPACINGS.FOUR,
            top: SPACINGS.FOUR,
          }
        : {}
    }
    onPress={onPress}
    disabled={disabled}
    variant={variant}
    style={style}
    active={active}
    small={small}
    elevated={elevated}
    noBackground={noBackground}>
    {loading ? (
      <ActivityIndicator
        size="small"
        color={
          fill
            ? fill
            : disabled || active || variant !== 'tertiary'
            ? COLORS.WHITE
            : COLORS.BLACK
        }
      />
    ) : (
      <Icon
        fill={
          fill
            ? fill
            : disabled || active || variant !== 'tertiary'
            ? COLORS.WHITE
            : COLORS.BLACK
        }
      />
    )}
  </StyledIconButton>
);

export default React.memo(IconButton);
