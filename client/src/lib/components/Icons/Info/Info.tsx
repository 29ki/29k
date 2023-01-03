import React from 'react';
import {Path} from 'react-native-svg';
import {IconType} from '..';
import {COLORS} from '../../../../../../shared/src/constants/colors';
import Icon from '../Icon';

export const InfoIcon: IconType = ({fill = COLORS.BLACK}) => (
  <Icon>
    <Path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M14.123 18.956v-4.717a.85.85 0 1 1 1.7 0v4.716a.85.85 0 0 1-1.7 0ZM14.123 11.027v-.036a.85.85 0 0 1 1.7 0v.036a.85.85 0 1 1-1.7 0Z"
      fill={fill}
    />
    <Path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M14.93 23.062a7.922 7.922 0 1 0 0-15.844 7.922 7.922 0 0 0 0 15.844Zm0 1.7a9.622 9.622 0 0 0 9.622-9.622 9.622 9.622 0 0 0-9.623-9.622 9.622 9.622 0 1 0 0 19.244Z"
      fill={fill}
    />
  </Icon>
);
