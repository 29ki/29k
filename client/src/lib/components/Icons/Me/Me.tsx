import React from 'react';
import {Path} from 'react-native-svg';
import {IconType} from '..';
import {COLORS} from '../../../../../../shared/src/constants/colors';
import Icon from '../Icon';

export const MeIcon: IconType = ({fill = COLORS.BLACK}) => (
  <Icon>
    <Path
      d="M15.0088 14.5752C16.9248 14.5752 18.5508 12.8701 18.5508 10.6641C18.5508 8.51074 16.916 6.8584 15.0088 6.8584C13.0928 6.8584 11.4492 8.53711 11.458 10.6816C11.458 12.8701 13.084 14.5752 15.0088 14.5752ZM9.52441 22.749H20.4756C21.9258 22.749 22.4268 22.3096 22.4268 21.501C22.4268 19.2422 19.5615 16.1309 15 16.1309C10.4473 16.1309 7.57324 19.2422 7.57324 21.501C7.57324 22.3096 8.07422 22.749 9.52441 22.749Z"
      fill={fill}
    />
  </Icon>
);
