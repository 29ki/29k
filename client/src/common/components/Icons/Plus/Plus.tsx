import React from 'react';
import {Path} from 'react-native-svg';
import {IconType} from '..';
import {COLORS} from '../../../constants/colors';
import Icon from '../Icon';

export const PlusIcon: IconType = ({fill = COLORS.GREY}) => (
  <Icon>
    <Path
      d="M15.867 9.064v12M21.867 15.064h-12"
      stroke={fill}
      strokeWidth={2}
      strokeLinecap="round"
    />
  </Icon>
);
