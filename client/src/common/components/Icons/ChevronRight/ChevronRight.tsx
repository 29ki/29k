import React from 'react';
import {Path} from 'react-native-svg';
import {IconType} from '..';
import {COLORS} from '../../../constants/colors';
import Icon from '../Icon';

export const ChevronRight: IconType = ({fill = COLORS.BLACK}) => (
  <Icon>
    <Path
      d="M11.5 22.5 19 15l-7.5-7.5"
      stroke={fill}
      strokeWidth={1.5}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </Icon>
);
