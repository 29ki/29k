import React from 'react';
import {Path} from 'react-native-svg';
import {IconType} from '..';
import {COLORS} from '../../../../../../shared/src/constants/colors';
import Icon from '../Icon';

export const ExploreFillIcon: IconType = ({fill = COLORS.BLACK}) => (
  <Icon>
    <Path
      d="M15 25c5.523 0 10-4.477 10-10S20.523 5 15 5 5 9.477 5 15s4.477 10 10 10Zm4.224-14.854-6.87 1.843a.51.51 0 0 0-.365.365l-1.843 6.87c-.1.384.246.74.639.64l6.87-1.844a.51.51 0 0 0 .365-.365l1.843-6.87a.523.523 0 0 0-.639-.639ZM16.341 15a1.341 1.341 0 1 1-2.682 0 1.341 1.341 0 0 1 2.682 0Z"
      fillRule="evenodd"
      clipRule="evenodd"
      fill={fill}
    />
  </Icon>
);
