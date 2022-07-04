import React from 'react';
import {TouchableOpacity} from 'react-native';
import styled from 'styled-components/native';
import {COLORS} from '../../constants/colors';
import {B1} from '../Typography/Text/Text';

const ButtonComponent = styled.View`
  background-color: ${COLORS.SUCCESS_GREEN};
  padding: 10px 20px;
  border-radius: 15px;
  align-items: center;
`;

const ButtonText = styled(B1)`
  color: ${COLORS.WHITE};
`;

const Button: React.FC<{
  onPress: () => void;
}> = ({children, onPress}) => (
  <TouchableOpacity onPress={onPress}>
    <ButtonComponent>
      <ButtonText>{children}</ButtonText>
    </ButtonComponent>
  </TouchableOpacity>
);

export default Button;
