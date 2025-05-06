import React from 'react';
import {Path} from 'react-native-svg';
import {IconType} from '..';
import {COLORS} from '../../../../../../shared/src/constants/colors';
import Icon from '../Icon';

export const EyeIcon: IconType = ({fill = COLORS.BLACK, style}) => (
  <Icon style={style}>
    <Path fill={fill} d="M19.7 14.7a4.7 4.7 0 1 1-9.4 0 4.7 4.7 0 0 1 9.4 0Z" />
    <Path
      fill={fill}
      fillRule="evenodd"
      d="M27.076 14.663c0-1.802-4.851-7.611-12.067-7.611-7.128 0-12.085 5.81-12.085 7.611 0 1.802 4.957 7.62 12.085 7.62 7.216 0 12.067-5.818 12.067-7.62Zm-2.039 0c0-1.028-4.438-5.889-10.028-5.889-5.608 0-10.046 4.659-10.046 5.89 0 1.23 4.438 5.897 10.046 5.897 5.59 0 10.028-4.87 10.028-5.898Z"
      clipRule="evenodd"
    />
  </Icon>
);
