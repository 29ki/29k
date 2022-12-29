import React from 'react';
import {Path} from 'react-native-svg';
import {IconType} from '..';
import {COLORS} from '../../../../../../shared/src/constants/colors';
import Icon from '../Icon';

export const MinusIcon: IconType = ({fill = COLORS.BLACK}) => (
  <Icon>
    <Path
      d="M22.882 14.64a1.08 1.08 0 0 1-1.074 1.074H8.173a1.08 1.08 0 0 1-1.074-1.074c0-.593.49-1.073 1.074-1.073h13.635c.584 0 1.074.48 1.074 1.073Z"
      fill={fill}
    />
  </Icon>
);
