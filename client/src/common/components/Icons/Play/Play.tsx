import React from 'react';
import {Path} from 'react-native-svg';
import {IconType} from '..';
import {COLORS} from '../../../constants/colors';
import Icon from '../Icon';

export const Play: IconType = ({fill = COLORS.BLACK}) => (
  <Icon>
    <Path
      d="M10.009 22.898c.395 0 .744-.141 1.177-.395l11.121-6.432c.81-.471 1.15-.838 1.15-1.432 0-.593-.34-.95-1.15-1.43L11.186 6.775c-.433-.254-.782-.395-1.177-.395-.772 0-1.319.593-1.319 1.525v13.466c0 .942.547 1.526 1.319 1.526Z"
      fill={fill}
    />
  </Icon>
);
