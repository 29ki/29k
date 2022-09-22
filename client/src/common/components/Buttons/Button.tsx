import React from 'react';
import styled from 'styled-components/native';
import {COLORS} from '../../constants/colors';
import {SPACINGS} from '../../constants/spacings';
import {B2} from '../Typography/Text/Text';
import {IconType} from '../Icons';
import {ActivityIndicator} from 'react-native';
import BaseButton, {BaseButtonProps, ButtonVariant} from './BaseButton';

const IconWrapper = styled.View({
  width: 21,
  height: 21,
  alignItems: 'center',
  justifyContent: 'center',
});

const LeftIconWrapper = styled(IconWrapper)({
  marginRight: -SPACINGS.TWELVE,
  marginLeft: SPACINGS.TWELVE,
});

const RightIconWrapper = styled(IconWrapper)({
  marginLeft: -SPACINGS.TWELVE,
  marginRight: SPACINGS.TWELVE,
});

type ButtonTextProps = {
  variant?: ButtonVariant;
  small?: boolean;
  active?: boolean;
  disabled?: boolean;
  children: React.ReactNode;
};

const ButtonText = styled(B2)<ButtonTextProps>(
  ({variant, small, active, disabled}) => ({
    height: 20,
    color:
      disabled || active || variant !== 'tertiary'
        ? COLORS.WHITE
        : COLORS.BLACK,
    marginVertical: small ? 8 : SPACINGS.TWELVE,
    marginHorizontal: SPACINGS.SIXTEEN,
  }),
);

type ButtonProps = BaseButtonProps & {
  LeftIcon?: IconType;
  RightIcon?: IconType;
  loading?: boolean;
};

const Button: React.FC<ButtonProps> = ({
  children,
  onPress,
  variant = 'primary',
  style,
  disabled,
  loading,
  small,
  LeftIcon,
  RightIcon,
  elevated,
  active,
}) => (
  <BaseButton
    onPress={onPress}
    variant={variant}
    elevated={elevated}
    active={active}
    small={small}
    style={style}
    disabled={disabled}>
    {loading && (
      <LeftIconWrapper>
        <ActivityIndicator
          size="small"
          color={
            variant === 'tertiary' && !active ? COLORS.BLACK : COLORS.WHITE
          }
        />
      </LeftIconWrapper>
    )}
    {LeftIcon && (
      <LeftIconWrapper>
        <LeftIcon
          fill={
            disabled || active || variant !== 'tertiary'
              ? COLORS.WHITE
              : COLORS.BLACK
          }
        />
      </LeftIconWrapper>
    )}
    <ButtonText
      small={small}
      variant={variant}
      active={active}
      disabled={disabled}>
      {children}
    </ButtonText>
    {RightIcon && (
      <RightIconWrapper>
        <RightIcon
          fill={
            disabled || active || variant !== 'tertiary'
              ? COLORS.WHITE
              : COLORS.BLACK
          }
        />
      </RightIconWrapper>
    )}
  </BaseButton>
);

export default Button;
