import React from 'react';
import {Path} from 'react-native-svg';
import {IconType} from '..';
import {COLORS} from '../../../../../../shared/src/constants/colors';
import Icon from '../Icon';

export const HangUpIcon: IconType = ({fill = COLORS.ACTIVE}) => (
  <Icon>
    <Path
      fillRule="evenodd"
      clipRule="evenodd"
      d="m23.92 26.379-10.102 1.47a.828.828 0 0 1-.67-.201.856.856 0 0 1-.29-.647V3a.87.87 0 0 1 .311-.667.836.836 0 0 1 .706-.172L23.977 4.7a.84.84 0 0 1 .479.3.868.868 0 0 1 .187.539v19.992a.865.865 0 0 1-.206.561.837.837 0 0 1-.517.287Zm-7.246-12.255a1.075 1.075 0 0 0-.594-.184l-.008-.011a1.072 1.072 0 0 0-.991.657c-.054.13-.081.268-.08.408a1.06 1.06 0 0 0 .65.992 1.076 1.076 0 0 0 1.17-.22 1.063 1.063 0 0 0-.147-1.642Z"
      fill={fill}
    />
    <Path
      d="M10.714 5.357H6.696c-.355 0-.695.17-.947.47-.25.302-.392.711-.392 1.137v16.072c0 .426.141.835.392 1.136.252.302.592.47.947.47h4.018"
      stroke={fill}
      strokeWidth={1.5}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </Icon>
);
