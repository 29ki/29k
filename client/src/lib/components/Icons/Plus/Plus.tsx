import React from 'react';
import {Path} from 'react-native-svg';
import {IconType} from '..';
import {COLORS} from '../../../../../../shared/src/constants/colors';
import Icon from '../Icon';

export const PlusIcon: IconType = ({fill = COLORS.BLACK}) => (
  <Icon>
    <Path
      d="M8.182 15.703h5.744v5.744c0 .584.48 1.074 1.074 1.074a1.08 1.08 0 0 0 1.073-1.074v-5.744h5.745a1.08 1.08 0 0 0 1.073-1.073 1.08 1.08 0 0 0-1.073-1.074h-5.745V7.812A1.08 1.08 0 0 0 15 6.738a1.08 1.08 0 0 0-1.074 1.074v5.744H8.182A1.08 1.08 0 0 0 7.11 14.63c0 .593.49 1.073 1.073 1.073Z"
      fill={fill}
    />
  </Icon>
);
