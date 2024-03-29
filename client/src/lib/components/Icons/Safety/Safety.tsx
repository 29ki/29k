import React from 'react';
import {ClipPath, Defs, G, Path} from 'react-native-svg';
import {IconType} from '..';
import {COLORS} from '../../../../../../shared/src/constants/colors';
import Icon from '../Icon';

export const SafetyIcon: IconType = ({fill = COLORS.BLACK, style}) => (
  <Icon style={style}>
    <G clipPath="url(#a)">
      <Path
        d="M14.953 24.206c.17 0 .414-.065.66-.188 5.395-2.778 7.184-4.237 7.184-7.618V9.403c0-1.11-.433-1.516-1.365-1.902-1.036-.433-4.483-1.648-5.49-1.987-.311-.094-.66-.16-.99-.16-.32 0-.668.066-.978.16-1.017.32-4.464 1.563-5.49 1.987-.933.377-1.366.791-1.366 1.902V16.4c0 3.38 1.865 4.708 7.185 7.618.245.132.49.188.65.188Zm.01-8.23c-.556 0-.876-.31-.895-.876l-.132-4.708c-.019-.574.395-.989 1.017-.989.603 0 1.045.415 1.026.998l-.15 4.69c-.02.584-.33.885-.867.885Zm0 3.249c-.641 0-1.168-.461-1.168-1.083 0-.612.518-1.083 1.167-1.083.64 0 1.159.462 1.159 1.083 0 .631-.528 1.083-1.159 1.083Z"
        fill="#378D88"
      />
    </G>
    <Defs>
      <ClipPath id="a">
        <Path fill={fill} d="M0 0h30v30H0z" />
      </ClipPath>
    </Defs>
  </Icon>
);
