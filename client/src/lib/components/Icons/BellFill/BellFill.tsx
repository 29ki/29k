import React from 'react';
import {Path} from 'react-native-svg';
import {IconType} from '..';
import {COLORS} from '../../../../../../shared/src/constants/colors';
import Icon from '../Icon';

export const BellFillIcon: IconType = ({fill = COLORS.BLACK}) => (
  <Icon>
    <Path
      d="M21.9 17.44c-.62-.61-.77-1.82-.89-3.06-.12-3.31-1.1-5.73-3.38-6.55-.34-1.17-1.32-2.06-2.63-2.06-1.31 0-2.29.89-2.62 2.06-2.29.83-3.26 3.24-3.39 6.55-.11 1.24-.26 2.45-.89 3.06-.8.76-1.65 1.56-1.65 2.51 0 .76.56 1.26 1.48 1.26h14.15c.91 0 1.48-.5 1.48-1.26 0-.94-.85-1.74-1.65-2.51h-.01ZM15 24.23c1.19 0 2.01-.9 2.05-1.9h-4.09c.04.99.85 1.9 2.04 1.9Z"
      fill={fill}
    />
  </Icon>
);
