import React from 'react';
import {Path} from 'react-native-svg';
import {IconType} from '..';
import {COLORS} from '../../../../../../shared/src/constants/colors';
import Icon from '../Icon';

export const CloseIcon: IconType = ({fill = COLORS.BLACK}) => (
  <Icon>
    <Path
      d="m9.42 10.568 4.062 4.062L9.42 18.69a1.08 1.08 0 0 0 0 1.519 1.08 1.08 0 0 0 1.518 0L15 16.148l4.062 4.062a1.08 1.08 0 0 0 1.518 0 1.08 1.08 0 0 0 0-1.519l-4.062-4.061 4.062-4.062a1.08 1.08 0 0 0 0-1.518 1.08 1.08 0 0 0-1.518 0L15 13.11 10.938 9.05a1.08 1.08 0 0 0-1.518 0 1.08 1.08 0 0 0 0 1.518Z"
      fill={fill}
    />
  </Icon>
);
