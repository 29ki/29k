import React from 'react';
import {Path} from 'react-native-svg';
import {IconType} from '..';
import {COLORS} from '../../../../../../shared/src/constants/colors';
import Icon from '../Icon';

export const ArrowLeftIcon: IconType = ({fill = COLORS.BLACK, style}) => (
  <Icon style={style}>
    <Path
      d="M6.907 15.788c0 .282.123.565.34.772l6.214 6.206c.226.216.471.32.745.32.593 0 1.026-.424 1.026-.998a1 1 0 0 0-.31-.744l-2.12-2.147-2.73-2.496 2.194.132h11.413c.621 0 1.055-.433 1.055-1.045 0-.622-.434-1.055-1.055-1.055H12.266l-2.185.132 2.721-2.496 2.12-2.147a1 1 0 0 0 .31-.744c0-.574-.433-.998-1.026-.998-.274 0-.528.104-.773.34l-6.187 6.186c-.216.207-.339.49-.339.782Z"
      fill={fill}
    />
  </Icon>
);
