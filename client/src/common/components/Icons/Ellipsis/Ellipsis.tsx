import React from 'react';
import {Circle} from 'react-native-svg';
import {IconType} from '..';
import {COLORS} from '../../../../../../shared/src/constants/colors';
import Icon from '../Icon';

export const EllipsisIcon: IconType = ({fill = COLORS.BLACK}) => (
  <Icon>
    <Circle cx="15" cy="7" r="2" fill={fill} />
    <Circle cx="15" cy="15" r="2" fill={fill} />
    <Circle cx="15" cy="23" r="2" fill={fill} />
  </Icon>
);
