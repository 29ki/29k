import React from 'react';
import {Path} from 'react-native-svg';
import {IconType} from '..';
import {COLORS} from '../../../../../../shared/src/constants/colors';
import Icon from '../Icon';

export const StarFillIcon: IconType = ({fill = COLORS.BLACK}) => (
  <Icon>
    <Path
      d="M10.7364 22.7958L15.0152 19.6526L19.2939 22.7958C20.1659 23.4447 21.2001 22.8566 20.7946 21.6805L19.1317 16.6716L23.4916 13.5284C24.3839 12.8795 24.0391 11.7642 22.9441 11.7642H17.55L15.948 6.77566C15.6032 5.74145 14.4068 5.74145 14.0823 6.77566L12.46 11.7642H7.04565C5.97088 11.7642 5.60587 12.8795 6.51841 13.5284L10.8986 16.6716L9.21547 21.6805C8.80989 22.8363 9.8441 23.4447 10.7364 22.7958Z"
      fill={fill}
    />
  </Icon>
);
