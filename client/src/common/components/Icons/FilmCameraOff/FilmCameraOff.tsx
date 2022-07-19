import React from 'react';
import {Path, Rect} from 'react-native-svg';
import {IconType} from '..';
import {COLORS} from '../../../constants/colors';
import Icon from '../Icon';

export const FilmCameraOffIcon: IconType = ({fill = COLORS.GREY200}) => (
  <Icon>
    <Rect
      x={3.75}
      y={7.75}
      width={17.5}
      height={14.5}
      rx={1.25}
      stroke={fill}
      strokeWidth={1.5}
    />
    <Path
      d="M21 12.5l4.615-1.923A1 1 0 0127 11.5v7.113a1 1 0 01-1.316.948L21 18"
      stroke={fill}
      strokeWidth={1.5}
    />
    <Path
      d="M24 5L3.5 25.5"
      stroke={fill}
      strokeWidth={1.5}
      strokeLinecap="round"
    />
  </Icon>
);
