import * as React from 'react';
import {ClipPath, Defs, G, Path} from 'react-native-svg';

import {IconType} from '..';
import {COLORS} from '../../../../../../shared/src/constants/colors';
import Icon from '../Icon';

export const JourneyFillIcon: IconType = ({fill = COLORS.BLACK}) => (
  <Icon>
    <G clipPath="url(#a)">
      <Path
        d="M26.5 10.69c0-1.36-.93-2.49-2.19-2.83V6.75c0-.41-.34-.75-.75-.75s-.75.34-.75.75v1.11a2.929 2.929 0 0 0-2.19 2.83c0 1.36.93 2.49 2.19 2.83v5.7c0 1.88-1.53 3.41-3.41 3.41-1.88 0-3.41-1.53-3.41-3.41v-1.33a2.929 2.929 0 0 0 2.19-2.83c0-1.36-.93-2.49-2.19-2.83V10.9c0-2.71-2.2-4.91-4.91-4.91S6.19 8.2 6.19 10.91v5.41A2.929 2.929 0 0 0 4 19.15c0 1.36.93 2.49 2.19 2.83v1.4c0 .41.34.75.75.75s.75-.34.75-.75v-1.4a2.94 2.94 0 0 0 2.19-2.83c0-1.36-.93-2.49-2.19-2.83v-5.41c0-1.88 1.53-3.41 3.41-3.41 1.88 0 3.41 1.53 3.41 3.41v1.33a2.929 2.929 0 0 0-2.19 2.83c0 1.36.93 2.49 2.19 2.83v1.33c0 2.71 2.2 4.91 4.91 4.91s4.91-2.2 4.91-4.91v-5.7a2.929 2.929 0 0 0 2.19-2.83l-.02-.01Z"
        fill={fill}
      />
    </G>
    <Defs>
      <ClipPath id="a">
        <Path
          fill="transparent"
          transform="translate(4 6)"
          d="M0 0h22.5v18.13H0z"
        />
      </ClipPath>
    </Defs>
  </Icon>
);
