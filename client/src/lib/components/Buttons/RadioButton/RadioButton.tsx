import React from 'react';
import {TouchableOpacity} from 'react-native';
import styled from 'styled-components/native';
import {COLORS} from '../../../../../../shared/src/constants/colors';

type RadioButtonProps = {
  onPress: () => void;
  active: boolean;
  color?: string;
};

const Wrapper = styled.View<{
  color: RadioButtonProps['color'];
  active: RadioButtonProps['active'];
}>(({color, active}) => ({
  height: 24,
  width: 24,
  borderRadius: 12,
  borderWidth: 2,
  borderColor: active ? color : COLORS.GREYDARK,
  alignItems: 'center',
  justifyContent: 'center',
}));

const Filler = styled.View<{color: RadioButtonProps['color']}>(({color}) => ({
  height: 12,
  width: 12,
  borderRadius: 6,
  backgroundColor: color,
}));

const RadioButton: React.FC<RadioButtonProps> = ({
  onPress,
  active,
  color = COLORS.PRIMARY,
}) => (
  <TouchableOpacity onPress={onPress}>
    <Wrapper color={color} active={active}>
      {active ? <Filler color={color} /> : null}
    </Wrapper>
  </TouchableOpacity>
);

export default React.memo(RadioButton);
