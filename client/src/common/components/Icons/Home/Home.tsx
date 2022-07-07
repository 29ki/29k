import React from 'react';
import {Path} from 'react-native-svg';
import {COLORS} from '../../../constants/colors';
import Icon from '../Icon';

export const HomeIcon = ({fill = COLORS.GREY}) => (
  <Icon>
    <Path
      d="m3 27 5.999-13.057 4.544-9.885c.647-1.41 2.266-1.41 2.913 0l4.545 9.885L26.999 27"
      stroke={fill}
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </Icon>
);
