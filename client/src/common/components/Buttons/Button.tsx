import React from 'react';
import styled from 'styled-components/native';
import {COLORS} from '../../constants/colors';
import {B1} from '../Typography/Text/Text';

type ButtonProps = {
  primary?: boolean;
};
const ButtonComponent = styled.TouchableOpacity<ButtonProps>(({primary}) => ({
  minHeight: 58,
  backgroundColor: primary ? COLORS.GREY : 'transparent',
  paddingHorizontal: 24,
  borderWidth: 1.5,
  borderColor: COLORS.GREY,
  borderRadius: 24,
  alignItems: 'center',
  justifyContent: 'center',
  flexDirection: 'row',
}));

export const ButtonText = styled(B1)<ButtonProps>(({primary}) => ({
  color: primary ? COLORS.YELLOW : COLORS.GREY,
}));

const Button: React.FC<{
  onPress?: () => void;
  primary?: boolean;
}> = ({children, onPress = () => {}, primary = false}) => (
  <ButtonComponent onPress={onPress} primary={primary}>
    {typeof children === 'string' ? (
      <ButtonText primary={primary}>{children}</ButtonText>
    ) : (
      children
    )}
  </ButtonComponent>
);

export default Button;
