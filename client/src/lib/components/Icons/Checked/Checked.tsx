import React from 'react';
import {Circle} from 'react-native-svg';
import {IconType} from '..';
import {COLORS} from '../../../../../../shared/src/constants/colors';
import Icon from '../Icon';

export const CheckedIcon: IconType = ({fill = COLORS.BLACK}) => (
  <Icon>
    <Circle cx={15} cy={15} r={8} fill={fill} />
  </Icon>
);
