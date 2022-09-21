import React from 'react';
import {Path} from 'react-native-svg';
import {IconType} from '..';
import {COLORS} from '../../../constants/colors';
import Icon from '../Icon';

export const ProfileIcon: IconType = ({fill = COLORS.BLACK}) => (
  <Icon>
    <Path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M15 23.043a8.043 8.043 0 1 1 0-16.086 8.043 8.043 0 0 1 0 16.086ZM5.357 15a9.643 9.643 0 1 0 19.286 0 9.643 9.643 0 0 0-19.286 0Z"
      fill={fill}
    />
    <Path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M19.34 14.238a.8.8 0 0 0-.8.8 3.502 3.502 0 1 1-7.005 0 .8.8 0 0 0-1.6 0 5.102 5.102 0 0 0 5.103 5.103 5.102 5.102 0 0 0 5.103-5.103.8.8 0 0 0-.8-.8Z"
      fill={fill}
    />
  </Icon>
);
