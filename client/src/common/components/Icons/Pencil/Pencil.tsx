import React from 'react';
import {Path} from 'react-native-svg';
import {IconType} from '..';
import {COLORS} from '../../../../../../shared/src/constants/colors';
import Icon from '../Icon';

export const PencilIcon: IconType = ({fill = COLORS.BLACK}) => (
  <Icon>
    <Path
      d="M12.066 23.634 6 24.502l.866-6.068L19.223 6.077a3.677 3.677 0 0 1 5.2 5.2L12.066 23.634Z"
      fill={fill}
    />
  </Icon>
);
