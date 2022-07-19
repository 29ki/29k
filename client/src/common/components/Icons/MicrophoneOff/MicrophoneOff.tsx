import React from 'react';
import {Path, Rect} from 'react-native-svg';
import {IconType} from '..';
import {COLORS} from '../../../constants/colors';
import Icon from '../Icon';

export const MicrophoneOffIcon: IconType = ({fill = COLORS.GREY200}) => (
  <Icon>
    <Rect
      x={11.75}
      y={4.75}
      width={6.5}
      height={13.5}
      rx={3.25}
      stroke={fill}
      strokeWidth={1.5}
    />
    <Path
      d="M15 26v-3.667M8 15v.333a7 7 0 007 7v0a7 7 0 007-7V15M24 5.5L5.5 24"
      stroke={fill}
      strokeWidth={1.5}
      strokeLinecap="round"
    />
  </Icon>
);
