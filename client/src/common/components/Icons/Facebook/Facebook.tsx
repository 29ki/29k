import React from 'react';
import {Path} from 'react-native-svg';
import {IconType} from '..';
import {COLORS} from '../../../../../../shared/src/constants/colors';
import Icon from '../Icon';

export const FacebookIcon: IconType = ({fill = COLORS.BLACK}) => (
  <Icon>
    <Path
      d="M13.35 24.9C8.6 24.05 5 19.95 5 15 5 9.5 9.5 5 15 5s10 4.5 10 10c0 4.95-3.6 9.05-8.35 9.9l-.55-.45h-2.2l-.55.45Z"
      fill={fill}
    />
    <Path
      d="m18.9 17.8.45-2.8H16.7v-1.95c0-.8.3-1.4 1.5-1.4h1.3V9.1c-.7-.1-1.5-.2-2.2-.2-2.3 0-3.9 1.4-3.9 3.9V15h-2.5v2.8h2.5v7.05a9.206 9.206 0 0 0 3.3 0V17.8h2.2Z"
      fill="white"
    />
  </Icon>
);
