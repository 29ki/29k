import React from 'react';
import {Path} from 'react-native-svg';
import {IconType} from '..';
import {COLORS} from '../../../constants/colors';
import Icon from '../Icon';

export const HomeIcon: IconType = ({fill = COLORS.GREY}) => (
  <Icon>
    <Path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M16 5.751c-.544-.525-1.456-.525-2.01 0l-7.172 6.876c-.256.234-.39.553-.39.882v10.134a1 1 0 0 0 1 1h15.143a1 1 0 0 0 1-1V13.509c0-.329-.133-.638-.389-.882L16 5.75Zm-1.005 1.254-6.966 6.678v9.36H21.97v-9.36l-6.976-6.678Z"
      fill={fill}
    />
  </Icon>
);
