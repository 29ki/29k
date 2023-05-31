import {StyleSheet} from 'react-native';
import styled from 'styled-components/native';
import {COLORS} from '../../../../../shared/src/constants/colors';

const ActionItem = styled.View<{hideBorder?: boolean}>(({hideBorder}) => ({
  flexDirection: 'row',
  alignItems: 'center',
  minHeight: 44,
  borderTopWidth: !hideBorder ? StyleSheet.hairlineWidth : undefined,
  borderTopColor: !hideBorder ? COLORS.GREYMEDIUM : undefined,
  marginTop: -1, // Hides the first divider
}));

export default ActionItem;
