import React from 'react';
import {Path} from 'react-native-svg';
import {IconType} from '..';
import {COLORS} from '../../../../../../shared/src/constants/colors';
import Icon from '../Icon';

export const ChevronLeftIcon: IconType = ({fill = COLORS.BLACK, style}) => (
  <Icon style={style}>
    <Path
      d="M18.5 7.5 11 15l7.5 7.5"
      stroke={fill}
      strokeWidth={1.5}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </Icon>
);
