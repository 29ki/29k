import React from 'react';
import {Circle, Path} from 'react-native-svg';
import {COLORS} from '../../../constants/colors';
import Icon from '../Icon';

export const ProfileIcon = ({fill = COLORS.GREY800}) => (
  <Icon>
    <Circle cx={15} cy={10} r={3.75} stroke={fill} strokeWidth={1.5} />
    <Path
      d="M7.26 23.877a.75.75 0 00.74.873h14a.75.75 0 00.74-.873l-.014-.082a7.833 7.833 0 00-15.452 0l-.014.082z"
      stroke={fill}
      strokeWidth={1.5}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </Icon>
);
