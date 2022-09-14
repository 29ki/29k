import React from 'react';
import {Path} from 'react-native-svg';
import {IconType} from '..';
import {COLORS} from '../../../constants/colors';
import Icon from '../Icon';

export const Plus: IconType = ({fill = COLORS.GREY}) => (
  <Icon>
    <Path
      d="M14 8V20 M20 14L8 14"
      strokeWidth="2"
      stroke={fill}
      strokeLinecap="round"
    />
  </Icon>
);
