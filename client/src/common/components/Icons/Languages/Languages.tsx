import React from 'react';
import {Path} from 'react-native-svg';
import {IconType} from '..';
import {COLORS} from '../../../../../../shared/src/constants/colors';
import Icon from '../Icon';

export const LanguagesIcon: IconType = ({fill = COLORS.BLACK}) => (
  <Icon>
    <Path
      d="M13.095 13.357h-1.547l-.595-1.428h-3.81l-.596 1.428H5L8.274 5.5H9.82l3.274 7.857Zm-4.048-6L7.737 10.5h2.62l-1.31-3.143Zm7.382 4.572H25v1.428h-8.571V11.93ZM25 14.786h-8.571v1.428H25v-1.428Zm-4.286 2.857H16.43v1.428h4.285v-1.428Zm-7.143 1.428v-1.428H10v-1.429H8.571v1.429H5v1.428h5.868a6.136 6.136 0 0 1-1.583 2.841A6.621 6.621 0 0 1 8.25 20.5H6.668c.363.872.882 1.67 1.532 2.355-.766.545-1.602.985-2.485 1.307l.502 1.338c1.099-.4 2.132-.963 3.065-1.669a11.779 11.779 0 0 0 3.075 1.669l.501-1.338a10.472 10.472 0 0 1-2.484-1.305 7.366 7.366 0 0 0 1.95-3.786h1.248Z"
      fillRule="evenodd"
      clipRule="evenodd"
      fill={fill}
    />
  </Icon>
);
