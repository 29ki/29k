import styled from 'styled-components/native';

import {SPACINGS} from '../../../../common/constants/spacings';
import IconButton, {
  BaseIconButtonProps,
} from '../../../../common/components/Buttons/IconButton/IconButton';

const SlideButton = styled(IconButton).attrs({
  variant: 'tertiary',
  elevated: true,
})<BaseIconButtonProps>(() => ({
  paddingVertical: SPACINGS.EIGHT,
  paddingHorizontal: SPACINGS.TWELVE,
}));

export default SlideButton;
