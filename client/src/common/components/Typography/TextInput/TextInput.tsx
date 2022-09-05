import React from 'react';
import styled from 'styled-components/native';

import {COLORS} from '../../../constants/colors';
import {SPACINGS} from '../../../constants/spacings';

type InputProps = {
  onChange: () => void;
};

const Input = styled.TextInput({
  borderBottomWidth: 1,
  borderBottomColor: COLORS.GREY,
  paddingBottom: 2,
  paddingHorizontal: 2,
  textAlign: 'center',
  fontSize: SPACINGS.THIRTYTWO,
});

const TextInput: React.FC<InputProps> = ({onChange}) => (
  <Input onChangeText={onChange} />
);

export default TextInput;
