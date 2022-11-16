import React from 'react';
import {Path} from 'react-native-svg';
import {IconType} from '..';
import {COLORS} from '../../../../../../shared/src/constants/colors';
import Icon from '../Icon';

export const PublicIcon: IconType = ({fill = COLORS.BLACK}) => (
  <Icon>
    <Path
      d="M7.193 23.698h9.125c1.262 0 1.884-.622 1.884-1.996v-7.054c0-1.205-.48-1.836-1.479-1.968v-2.505c0-2.194 1.403-3.4 3.08-3.4 1.685 0 3.079 1.206 3.079 3.4v1.987c0 .669.395 1.017.913 1.017.5 0 .895-.33.895-1.017v-1.817c0-3.578-2.383-5.302-4.887-5.302-2.505 0-4.888 1.724-4.888 5.302v2.307l-7.57.019c-1.272 0-2.044.621-2.044 1.977v7.054c0 1.374.621 1.996 1.892 1.996Z"
      fill={fill}
    />
  </Icon>
);
