import React from 'react';
import styled from 'styled-components/native';
import {ActivityIndicator} from 'react-native';
import {COLORS} from '../../../../../shared/src/constants/colors';
import {SPACINGS} from '../../constants/spacings';
import {Body16} from '../Typography/Body/Body';
import {IconType} from '../Icons';
import BaseButton, {BaseButtonProps, ButtonVariant} from './BaseButton';

const IconWrapper = styled.View({
  width: 21,
  height: 21,
  alignItems: 'center',
  justifyContent: 'center',
});

const LeftIconWrapper = styled(IconWrapper)({
  marginRight: -SPACINGS.TWELVE,
  marginLeft: SPACINGS.EIGHT,
});

const RightIconWrapper = styled(IconWrapper)({
  marginLeft: -SPACINGS.TWELVE,
  marginRight: SPACINGS.EIGHT,
});

const Spinner = styled(ActivityIndicator)({
  marginRight: -SPACINGS.EIGHT,
  marginLeft: SPACINGS.EIGHT,
});

type ButtonTextProps = {
  variant?: ButtonVariant;
  small?: boolean;
  active?: boolean;
  disabled?: boolean;
  children: React.ReactNode;
};

const ButtonText = styled(Body16).attrs({selectable: false})<ButtonTextProps>(
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
    hitSlop={{
      bottom: small ? SPACINGS.EIGHT : undefined,
      left: undefined,
      right: undefined,
      top: small ? SPACINGS.EIGHT : undefined,
    }}
    onPress={onPress}
    variant={variant}
    elevated={elevated}
    active={active}
    small={small}
    style={style}
    disabled={disabled}>
    {loading && (
      <Spinner
        size="small"
        color={
          disabled || active || variant !== 'tertiary'
            ? COLORS.WHITE
            : COLORS.BLACK
        }
      />
    )}
    {LeftIcon && !loading && (
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
      disabled={disabled}
      selectable={false}>
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

export default React.memo(Button);
