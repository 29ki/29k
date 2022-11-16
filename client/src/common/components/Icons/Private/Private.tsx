import React from 'react';
import {Path} from 'react-native-svg';
import {IconType} from '..';
import {COLORS} from '../../../../../../shared/src/constants/colors';
import Icon from '../Icon';

export const PrivateIcon: IconType = ({fill = COLORS.BLACK}) => (
  <Icon>
    <Path
      d="M10.433 23.698h9.134c1.262 0 1.884-.622 1.884-1.996v-7.054c0-1.243-.509-1.873-1.564-1.977v-2.326c0-3.578-2.382-5.302-4.887-5.302-2.505 0-4.887 1.724-4.887 5.302v2.354c-.98.15-1.564.772-1.564 1.95v7.053c0 1.374.622 1.996 1.884 1.996Zm1.488-13.523c0-2.194 1.393-3.4 3.079-3.4 1.676 0 3.08 1.206 3.08 3.4v2.477l-6.16.01v-2.487Z"
      fill={fill}
    />
  </Icon>
);
