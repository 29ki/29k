import React from 'react';
import {Path} from 'react-native-svg';
import {IconType} from '..';
import {COLORS} from '../../../constants/colors';
import Icon from '../Icon';

export const ProfileFillIcon: IconType = ({fill = COLORS.BLACK}) => (
  <Icon>
    <Path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M5.357 15c0 5.326 4.317 9.643 9.643 9.643A9.643 9.643 0 1 0 5.357 15Zm13.127.039a.857.857 0 1 1 1.714 0c0 2.85-2.31 5.16-5.16 5.16a5.16 5.16 0 0 1-5.16-5.16.857.857 0 0 1 1.715 0 3.445 3.445 0 1 0 6.89 0Z"
      fill={fill}
    />
    <Path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M6.957 15a8.043 8.043 0 1 0 16.086 0 8.043 8.043 0 0 0-16.086 0Zm9.927.039a2.457 2.457 0 0 1 4.914 0 6.76 6.76 0 0 1-6.76 6.76 6.76 6.76 0 0 1-6.76-6.76 2.457 2.457 0 0 1 4.915 0 1.845 1.845 0 1 0 3.69 0ZM15 24.643c-5.326 0-9.643-4.317-9.643-9.643A9.643 9.643 0 0 1 15 5.357c5.326 0 9.643 4.317 9.643 9.643A9.643 9.643 0 0 1 15 24.643Zm4.341-10.461a.857.857 0 0 0-.857.857 3.445 3.445 0 1 1-6.891 0 .857.857 0 0 0-1.714 0 5.16 5.16 0 0 0 5.16 5.16c2.85 0 5.16-2.31 5.16-5.16a.857.857 0 0 0-.858-.857Z"
      fill={fill}
    />
  </Icon>
);
