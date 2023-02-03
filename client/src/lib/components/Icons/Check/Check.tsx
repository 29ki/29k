import React from 'react';
import {Path} from 'react-native-svg';
import {IconType} from '..';
import {COLORS} from '../../../../../../shared/src/constants/colors';
import Icon from '../Icon';

export const CheckIcon: IconType = ({fill = COLORS.BLACK}) => (
  <Icon>
    <Path
      stroke={fill}
      d="M7 12.6739L13.1615 22L22.4037 8"
      strokeWidth={3}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </Icon>
);
