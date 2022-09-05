import React from 'react';
import styled from 'styled-components/native';
import {COLORS} from '../../constants/colors';
import {SPACINGS} from '../../constants/spacings';
import {B2} from '../Typography/Text/Text';
import TouchableOpacity from '../TouchableOpacity/TouchableOpacity';

type ButtonProps = {
  primary?: boolean;
  style?: object;
  disabled?: boolean;
};
const ButtonComponent = styled(TouchableOpacity)<ButtonProps>(({primary}) => ({
  minHeight: SPACINGS.THIRTYTWO,
  backgroundColor: primary ? COLORS.GREY200 : COLORS.BLACK_EASY,
  borderRadius: SPACINGS.SIXTEEN,
  alignItems: 'center',
  justifyContent: 'center',
  flexDirection: 'row',
}));

export const ButtonText = styled(B2)<ButtonProps>(({primary}) => ({
  color: primary ? COLORS.BLACK_EASY : COLORS.GREY100,
  marginVertical: SPACINGS.TWELVE,
  marginHorizontal: SPACINGS.SIXTEEN,
}));

const Button: React.FC<{
  onPress?: () => void;
  primary?: boolean;
  disabled?: boolean;
  style?: object;
}> = ({
  children,
  onPress = () => {},
  primary = false,
  style = {},
  disabled = false,
}) => (
  <ButtonComponent
    onPress={onPress}
    primary={primary}
    style={style}
    disabled={disabled}>
    {typeof children === 'string' ? (
      <ButtonText primary={primary}>{children}</ButtonText>
    ) : (
      children
    )}
  </ButtonComponent>
);

export default Button;
