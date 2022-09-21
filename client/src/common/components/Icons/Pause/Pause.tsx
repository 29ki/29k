import React from 'react';
import {Path} from 'react-native-svg';
import {IconType} from '..';
import {COLORS} from '../../../constants/colors';
import Icon from '../Icon';

export const Pause: IconType = ({fill = COLORS.BLACK}) => (
  <Icon>
    <Path
      d="M10.32 22.465h2.213c.895 0 1.356-.462 1.356-1.357V8.151c0-.913-.461-1.347-1.356-1.356H10.32c-.895 0-1.356.461-1.356 1.356v12.957c-.01.895.452 1.357 1.356 1.357Zm7.157 0h2.203c.895 0 1.356-.462 1.356-1.357V8.151c0-.913-.461-1.356-1.356-1.356h-2.203c-.904 0-1.356.461-1.356 1.356v12.957c0 .895.452 1.357 1.356 1.357Z"
      fill={fill}
    />
  </Icon>
);
