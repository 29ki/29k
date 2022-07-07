import React from 'react';
import {TouchableOpacity} from 'react-native';
import styled from 'styled-components/native';
import {COLORS} from '../../constants/colors';
import {B1} from '../Typography/Text/Text';

const ButtonComponent = styled.View({
  minHeight: 58,
  backgroundColor: COLORS.GREY,
  paddingHorizontal: 24,
  borderRadius: 24,
  alignItems: 'center',
  justifyContent: 'center',
  flexDirection: 'row',
});

export const ButtonText = styled(B1)({
  color: COLORS.YELLOW,
});

const Button: React.FC<{
  onPress: () => void;
}> = ({children, onPress}) => (
  <TouchableOpacity onPress={onPress}>
    <ButtonComponent>
      {typeof children === 'string' ? (
        <ButtonText>{children}</ButtonText>
      ) : (
        children
      )}
    </ButtonComponent>
  </TouchableOpacity>
);

export default Button;
