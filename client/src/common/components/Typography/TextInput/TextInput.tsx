import {TextInput} from 'react-native';
import styled from 'styled-components/native';

import {COLORS} from '../../../constants/colors';
import {SPACINGS} from '../../../constants/spacings';

const Input = styled(TextInput)({
  borderBottomWidth: 1,
  borderBottomColor: COLORS.GREY,
  paddingBottom: 2,
  paddingHorizontal: 2,
  textAlign: 'center',
  fontSize: SPACINGS.THIRTYTWO,
});

export default Input;
