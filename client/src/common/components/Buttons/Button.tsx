import React from 'react';
import {TouchableOpacity} from 'react-native';
import styled from 'styled-components/native';
import {COLORS} from '../../constants/colors';
import {B1} from '../Typography/Text/Text';

const ButtonComponent = styled.View({
  backgroundColor: COLORS.ROSE700,
  paddingVertical: 10,
  paddingHorizontal: 20,
  borderRadius: 15,
  alignItems: 'center',
});

const ButtonText = styled(B1)({
  color: COLORS.WHITE,
});

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
