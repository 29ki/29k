import React from 'react';
import styled from 'styled-components/native';
import {COLORS} from '../../constants/colors';
import {SPACINGS} from '../../constants/spacings';
import {B2} from '../Typography/Text/Text';

type ButtonProps = {
  primary?: boolean;
  style?: object;
};
const ButtonComponent = styled.TouchableOpacity<ButtonProps>(({primary}) => ({
  minHeight: 32,
  backgroundColor: primary ? COLORS.GREY200 : COLORS.BLACK_EASY,
  paddingHorizontal: 24,
  borderRadius: SPACINGS.SIXTEEN,
  alignItems: 'center',
  justifyContent: 'center',
  flexDirection: 'row',
}));

export const ButtonText = styled(B2)<ButtonProps>(({primary}) => ({
  color: primary ? COLORS.BLACK_EASY : COLORS.GREY100,
  fontWeight: 600,
  margin: 12,
}));

const Button: React.FC<{
  onPress?: () => void;
  primary?: boolean;
  style?: object;
}> = ({children, onPress = () => {}, primary = false, style = {}}) => (
  <ButtonComponent onPress={onPress} primary={primary} style={style}>
    {typeof children === 'string' ? (
      <ButtonText primary={primary}>{children}</ButtonText>
    ) : (
      children
    )}
  </ButtonComponent>
);

export default Button;
