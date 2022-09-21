import styled from 'styled-components/native';

import {COLORS} from '../../../../common/constants/colors';
import {IconType} from '../../../../common/components/Icons';
import {SPACINGS} from '../../../../common/constants/spacings';
import IconButton from '../../../../common/components/Buttons/IconButton/IconButton';

type SlideButtonProps = {
  onPress?: () => void;
  Icon: IconType;
  disabled?: boolean;
  fill?: string;
};

const SlideButton = styled(IconButton).attrs({
  fill: COLORS.BLACK,
})<SlideButtonProps>(({disabled}) => ({
  backgroundColor: COLORS.GREYLIGHTEST,
  color: COLORS.BLACK,
  paddingVertical: SPACINGS.EIGHT,
  paddingHorizontal: SPACINGS.TWELVE,
  boxShadow: '0px 4px 12px rgba(0, 0, 0, 0.16)',
  elevation: 1,
  opacity: disabled ? 0 : 1,
}));

export default SlideButton;
