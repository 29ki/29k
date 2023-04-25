import React from 'react';
import {Path} from 'react-native-svg';
import {IconType} from '..';
import {COLORS} from '../../../../../../shared/src/constants/colors';
import Icon from '../Icon';

export const ExploreIcon: IconType = ({fill = COLORS.BLACK}) => (
  <Icon>
    <Path
      d="M15 23.5a8.5 8.5 0 1 0 0-17 8.5 8.5 0 0 0 0 17ZM25 15c0 5.523-4.477 10-10 10S5 20.523 5 15 9.477 5 15 5s10 4.477 10 10Zm-5.966-5.58c.933-.244 1.799.601 1.556 1.55l-.003.009-1.842 6.867v.002c-.111.418-.44.78-.9.898L10.97 20.59a1.273 1.273 0 0 1-1.55-1.556v-.004l1.843-6.867v-.002c.11-.418.44-.78.9-.898l6.87-1.843Zm.002 1.553-6.358 1.705-1.705 6.358 6.358-1.705 1.705-6.358ZM16.341 15a1.341 1.341 0 1 1-2.682 0 1.341 1.341 0 0 1 2.682 0Z"
      fillRule="evenodd"
      clipRule="evenodd"
      fill={fill}
    />
  </Icon>
);
