import React from 'react';
import styled from 'styled-components/native';
import {COLORS} from '../../constants/colors';
import {SPACINGS} from '../../constants/spacings';
import {B2} from '../Typography/Text/Text';
import TouchableOpacity from '../TouchableOpacity/TouchableOpacity';
import {IconType} from '../Icons';
import {StyleSheet} from 'react-native';

const ButtonComponent = styled(TouchableOpacity)<ButtonProps>(({primary}) => ({
  backgroundColor: primary ? COLORS.GREY200 : COLORS.BLACK_EASY,
  borderRadius: SPACINGS.SIXTEEN,
  alignItems: 'center',
  justifyContent: 'center',
  flexDirection: 'row',
  overflow: 'hidden',
}));

const IconWrapper = styled.View({
  width: 26,
  height: 26,
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

const DisabledOverlay = styled.View({
  ...StyleSheet.absoluteFillObject,
  backgroundColor: COLORS.WHITE_EASY,
  opacity: 0.6,
});

export const ButtonText = styled(B2)<ButtonProps>(({primary}) => ({
  height: 20,
  color: primary ? COLORS.BLACK_EASY : COLORS.GREY100,
  marginVertical: SPACINGS.TWELVE,
  marginHorizontal: SPACINGS.SIXTEEN,
}));

type ButtonProps = {
  onPress?: () => void;
  primary?: boolean;
  style?: object;
  disabled?: boolean;
  LeftIcon?: IconType | React.ReactNode;
  RightIcon?: IconType | React.ReactNode;
  fill?: string;
  children: React.ReactNode;
};

const Button: React.FC<ButtonProps> = ({
  children,
  onPress = () => {},
  primary = false,
  style = {},
  disabled = false,
  LeftIcon,
  RightIcon,
  fill,
}) => (
  <ButtonComponent
    onPress={onPress}
    primary={primary}
    style={style}
    disabled={disabled}>
    {LeftIcon && (
      <LeftIconWrapper>
        <LeftIcon
          fill={fill ? fill : primary ? COLORS.BLACK_EASY : COLORS.GREY100}
        />
      </LeftIconWrapper>
    )}
    {typeof children === 'string' ? (
      <ButtonText primary={primary}>{children}</ButtonText>
    ) : (
      children
    )}
    {RightIcon && (
      <RightIconWrapper>
        <RightIcon
          fill={fill ? fill : primary ? COLORS.BLACK_EASY : COLORS.GREY100}
        />
      </RightIconWrapper>
    )}
    {disabled && <DisabledOverlay />}
  </ButtonComponent>
);

export default Button;
