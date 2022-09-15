import React from 'react';
import {Path} from 'react-native-svg';
import {IconType} from '..';
import {COLORS} from '../../../constants/colors';
import Icon from '../Icon';

export const HomeFillIcon: IconType = ({fill = COLORS.GREY}) => (
  <Icon>
    <Path
      d="m13.99 5.751-7.172 6.876c-.256.234-.39.553-.39.882v10.134a1 1 0 0 0 1 1h15.143a1 1 0 0 0 1-1V13.509c0-.329-.133-.638-.389-.882L16 5.75c-.543-.525-1.455-.525-2.008 0Z"
      fill={fill}
    />
  </Icon>
);
