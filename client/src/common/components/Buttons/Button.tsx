import React from 'react';
import styled from 'styled-components/native';
import {COLORS} from '../../constants/colors';
import {SPACINGS} from '../../constants/spacings';
import {B2} from '../Typography/Text/Text';
import TouchableOpacity from '../TouchableOpacity/TouchableOpacity';
import {IconType} from '../Icons';

const ButtonComponent = styled(TouchableOpacity)<ButtonProps>(({disabled}) => ({
  minHeight: SPACINGS.THIRTYTWO,
  backgroundColor: disabled ? COLORS.DISABLED : COLORS.BLACK_EASY,
  borderRadius: SPACINGS.SIXTEEN,
  alignItems: 'center',
  justifyContent: 'center',
  flexDirection: 'row',
}));

const IconWrapper = styled.View({
  width: 26,
  height: 26,
});

const LeftIconWrapper = styled(IconWrapper)({
  marginRight: -SPACINGS.TWELVE,
  marginLeft: SPACINGS.TWELVE,
});

const RightIconWrapper = styled(IconWrapper)({
  marginLeft: -SPACINGS.TWELVE,
  marginRight: SPACINGS.TWELVE,
});

export const ButtonText = styled(B2)({
  color: COLORS.GREY100,
  marginVertical: SPACINGS.TWELVE,
  marginHorizontal: SPACINGS.SIXTEEN,
});

type ButtonProps = {
  onPress?: () => void;
  style?: object;
  disabled?: boolean;
  LeftIcon?: IconType;
  RightIcon?: IconType;
  fill?: string;
  children: React.ReactNode;
};

const Button: React.FC<ButtonProps> = ({
  children,
  onPress = () => {},
  style = {},
  disabled = false,
  LeftIcon,
  RightIcon,
  fill,
}) => (
  <ButtonComponent onPress={onPress} style={style} disabled={disabled}>
    {LeftIcon && (
      <LeftIconWrapper>
        <LeftIcon fill={fill ? fill : COLORS.GREY100} />
      </LeftIconWrapper>
    )}
    {typeof children === 'string' ? (
      <ButtonText>{children}</ButtonText>
    ) : (
      children
    )}
    {RightIcon && (
      <RightIconWrapper>
        <RightIcon fill={fill ? fill : COLORS.GREY100} />
      </RightIconWrapper>
    )}
  </ButtonComponent>
);

export default Button;
