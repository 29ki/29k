import React from 'react';
import styled from 'styled-components/native';
import {COLORS} from '../../constants/colors';
import {SPACINGS} from '../../constants/spacings';
import {B2} from '../Typography/Text/Text';
import TouchableOpacity from '../TouchableOpacity/TouchableOpacity';
import {IconType} from '../Icons';
import {ActivityIndicator} from 'react-native';
import SETTINGS from '../../constants/settings';

const VARIANTS = {
  PRIMARY: 'primary',
  SECONDARY: 'secondary',
  TERTIARY: 'tertiary',
};

const ButtonComponent = styled(TouchableOpacity)<ButtonProps>(
  ({variant, small, elevated, disabled, active}) => ({
    // how to not allow it to exand in width?
    backgroundColor: disabled
      ? COLORS.GREY400
      : active
      ? COLORS.ROSE500
      : variant === VARIANTS.SECONDARY
      ? COLORS.BLACK_EASY
      : variant === VARIANTS.TERTIARY
      ? COLORS.GREY200
      : COLORS.GREEN,
    borderRadius: small ? SPACINGS.TWELVE : SPACINGS.SIXTEEN,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    ...(elevated ? {...SETTINGS.BOXSHADOW} : {}),
  }),
);

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

export const ButtonText = styled(B2)<ButtonProps>(
  ({variant, small, active, disabled}) => ({
    height: 20,
    color:
      disabled || active || variant !== VARIANTS.TERTIARY
        ? COLORS.GREY100
        : COLORS.BLACK_EASY,
    marginVertical: small ? 8 : SPACINGS.TWELVE,
    marginHorizontal: SPACINGS.SIXTEEN,
  }),
);

type ButtonProps = {
  onPress?: () => void;
  variant?: string;
  style?: object;
  disabled?: boolean;
  loading?: boolean;
  LeftIcon?: IconType;
  RightIcon?: IconType;
  fill?: string;
  children: React.ReactNode;
  small?: boolean;
  elevated?: boolean;
  active?: boolean;
};

const Button: React.FC<ButtonProps> = ({
  children,
  onPress = () => {},
  variant = VARIANTS.PRIMARY,
  style = {},
  disabled = false,
  loading = false,
  small = false,
  LeftIcon,
  RightIcon,
  fill,
  elevated = false,
  active = false,
}) => (
  <ButtonComponent
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
            fill
              ? fill
              : variant === VARIANTS.TERTIARY && !active
              ? COLORS.BLACK_EASY
              : COLORS.GREY100
          }
        />
      </LeftIconWrapper>
    )}
    {LeftIcon && (
      <LeftIconWrapper>
        <LeftIcon
          fill={
            fill
              ? fill
              : disabled || active || variant !== VARIANTS.TERTIARY
              ? COLORS.GREY100
              : COLORS.BLACK_EASY
          }
        />
      </LeftIconWrapper>
    )}
    {typeof children === 'string' ? (
      <ButtonText
        small={small}
        variant={variant}
        active={active}
        disabled={disabled}>
        {children}
      </ButtonText>
    ) : (
      children
    )}
    {RightIcon && (
      <RightIconWrapper>
        <RightIcon
          fill={
            fill
              ? fill
              : disabled || active || variant !== VARIANTS.TERTIARY
              ? COLORS.GREY100
              : COLORS.BLACK_EASY
          }
        />
      </RightIconWrapper>
    )}
  </ButtonComponent>
);

export default Button;
