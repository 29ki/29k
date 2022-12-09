import styled from 'styled-components/native';
import {COLORS} from '../../../../../shared/src/constants/colors';
import SETTINGS from '../../constants/settings';

const ActionList = styled.View({
  overflow: 'hidden',
  backgroundColor: COLORS.PURE_WHITE,
  borderRadius: SETTINGS.BORDER_RADIUS.ACTION_LISTS,
});

export default ActionList;
