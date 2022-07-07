import React from 'react';
import {Path} from 'react-native-svg';
import {COLORS} from '../../../constants/colors';
import Icon from '../Icon';

export const HomeIcon = ({fill = COLORS.GREY800}) => (
  <Icon>
    <Path
      d="M4.558 11.68a.75.75 0 00-.308.606V23c0 .414.336.75.75.75h20a.75.75 0 00.75-.75V12.286a.75.75 0 00-.308-.606l-10-7.286a.75.75 0 00-.884 0l-10 7.286z"
      stroke={fill}
      strokeWidth={1.5}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <Path
      d="M12 24v-7h6v7"
      stroke={fill}
      strokeWidth={1.5}
      strokeLinejoin="round"
    />
  </Icon>
);
