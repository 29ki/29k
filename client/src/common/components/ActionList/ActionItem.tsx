import {StyleSheet} from 'react-native';
import styled from 'styled-components/native';
import {COLORS} from '../../../../../shared/src/constants/colors';

const ActionItem = styled.View({
  flexDirection: 'row',
  alignItems: 'center',
  minHeight: 44,
  borderTopWidth: StyleSheet.hairlineWidth,
  borderTopColor: COLORS.GREYMEDIUM,
  marginTop: -1, // Hides the first divider
});

export default ActionItem;
