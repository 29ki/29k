import React from 'react';
import {Circle, Path} from 'react-native-svg';
import {COLORS} from '../../../constants/colors';
import Icon from '../Icon';

export const ProfileIcon = ({fill = COLORS.GREY}) => (
  <Icon>
    <Path
      d="M6 27c4.725-3.233 9.337-8.133 9.337-8.133s3.996-4.506 4.877-8.185c1.253-5.225-2.232-7.674-5.13-7.682-3.093 0-6.13 2.225-5.17 7.654.688 3.885 5.127 8.21 5.127 8.21s4.485 5.452 8.862 8.136"
      stroke={fill}
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </Icon>
);
