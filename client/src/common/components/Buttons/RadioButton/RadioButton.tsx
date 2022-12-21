import React from 'react';
import {TouchableOpacity} from 'react-native';
import styled from 'styled-components/native';
import {COLORS} from '../../../../../../shared/src/constants/colors';

type RadioButtonProps = {
  onPress: () => void;
  active: boolean;
};

const Wrapper = styled.View<{active: RadioButtonProps['active']}>(
  ({active}) => ({
    height: 24,
    width: 24,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: active ? COLORS.PRIMARY : COLORS.GREYDARK,
    alignItems: 'center',
    justifyContent: 'center',
  }),
);

const Filler = styled.View({
  height: 12,
  width: 12,
  borderRadius: 6,
  backgroundColor: COLORS.PRIMARY,
});

const RadioButton: React.FC<RadioButtonProps> = ({onPress, active}) => (
  <TouchableOpacity onPress={onPress}>
    <Wrapper active={active}>{active ? <Filler /> : null}</Wrapper>
  </TouchableOpacity>
);

export default RadioButton;
