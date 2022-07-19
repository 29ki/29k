import * as React from 'react';
import {Path} from 'react-native-svg';
import {IconType} from '..';
import {COLORS} from '../../../constants/colors';
import Icon from '../Icon';

export const LogoIcon: IconType = ({fill = COLORS.GREY}) => (
  <Icon>
    <Path
      d="M3 9.21c-.002-.552.108-1.1.325-1.611.217-.512.537-.976.94-1.368a4.34 4.34 0 0 1 1.408-.912A4.447 4.447 0 0 1 7.336 5c2.403 0 4.546 1.276 4.374 4.235-.23 3.932-8.555 6.636-8.572 10.989 0 2.125 1.516 4.765 5.497 4.776 1.461-.04 2.898-.37 4.223-.968m0-.053a21.238 21.238 0 0 0 6.288-4.256l1.61-1.724s3.378-3.693 4.125-6.7C25.937 7.01 22.992 5.008 20.542 5c-2.613 0-5.184 1.825-4.374 6.274.58 3.185 4.336 6.73 4.336 6.73s3.793 4.471 7.496 6.669"
      stroke={fill}
      strokeWidth={1.5}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </Icon>
);
