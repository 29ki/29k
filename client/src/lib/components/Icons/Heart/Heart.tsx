import React from 'react';
import {G, Path, Defs, ClipPath} from 'react-native-svg';
import {IconType} from '..';
import {COLORS} from '../../../../../../shared/src/constants/colors';
import Icon from '../Icon';

export const HeartIcon: IconType = ({fill = COLORS.BLACK, style}) => (
  <Icon style={style}>
    <G clipPath="url(#clip0_12628_61510)">
      <Path
        d="M5.46 11.983c0 4.021 3.381 7.995 8.636 11.385.292.189.65.377.895.377.244 0 .602-.188.894-.377 5.264-3.39 8.635-7.364 8.635-11.385 0-3.474-2.4-5.885-5.48-5.885-1.799 0-3.202.82-4.05 2.062-.828-1.233-2.24-2.062-4.04-2.062-3.088 0-5.49 2.41-5.49 5.885zm1.94-.009c0-2.373 1.564-3.983 3.664-3.983 1.695 0 2.646 1.026 3.24 1.92.263.387.442.51.687.51.254 0 .414-.133.687-.51.64-.875 1.554-1.92 3.24-1.92 2.109 0 3.672 1.61 3.672 3.983 0 3.315-3.447 6.987-7.42 9.624-.085.056-.142.094-.18.094-.037 0-.094-.038-.169-.094-3.974-2.637-7.42-6.31-7.42-9.624z"
        fill={fill}
      />
    </G>
    <Defs>
      <ClipPath id="clip0_12628_61510">
        <Path fill="#fff" d="M0 0H30V30H0z" />
      </ClipPath>
    </Defs>
  </Icon>
);
