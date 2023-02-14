import React from 'react';
import {Path} from 'react-native-svg';
import {IconType} from '..';
import {COLORS} from '../../../../../../shared/src/constants/colors';
import Icon from '../Icon';

export const StarIcon: IconType = ({fill = COLORS.BLACK}) => (
  <Icon>
    <Path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M19.294 22.796c.872.649 1.906.06 1.5-1.116l-1.662-5.008 4.36-3.144c.892-.649.547-1.764-.548-1.764H17.55l-1.602-4.988c-.345-1.035-1.541-1.035-1.866 0l-1.622 4.988H7.046c-1.075 0-1.44 1.116-.528 1.764l4.38 3.144-1.683 5.008c-.405 1.156.63 1.765 1.521 1.116l4.28-3.143 4.278 3.143ZM15.012 8.767l-1.462 4.497H8.723l3.95 2.835-1.522 4.531 3.864-2.839 3.846 2.825-1.5-4.517 3.932-2.835h-4.837l-1.444-4.497Z"
      fill={fill}
    />
  </Icon>
);
