import React from 'react';
import {Path} from 'react-native-svg';
import {IconType} from '..';
import {COLORS} from '../../../../../../shared/src/constants/colors';
import Icon from '../Icon';

export const HeartFillIcon: IconType = ({fill = COLORS.BLACK}) => (
  <Icon>
    <Path
      fill={fill}
      d="M14.096 24.683c-5.254-3.58-8.635-7.778-8.635-12.025 0-3.67 2.401-6.217 5.49-6.217 1.799 0 3.211.875 4.04 2.178.847-1.313 2.25-2.178 4.049-2.178 3.08 0 5.48 2.546 5.48 6.217 0 4.247-3.37 8.444-8.635 12.025-.291.199-.65.398-.894.398-.245 0-.603-.2-.895-.398Z"
    />
  </Icon>
);
