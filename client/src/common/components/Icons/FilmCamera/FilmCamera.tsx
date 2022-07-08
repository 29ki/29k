import React from 'react';
import {StyleSheet} from 'react-native';
import Svg, {Path, Rect} from 'react-native-svg';
import {COLORS} from '../../../constants/colors';

const style = StyleSheet.create({icon: {aspectRatio: 1}});

export const FilmCameraIcon = ({fill = COLORS.GREY200}) => (
  <Svg width="100%" height="100%" viewBox="0 0 30 30" style={style.icon}>
    <Rect
      x={3.75}
      y={7.75}
      width={17.5}
      height={14.5}
      rx={1.25}
      stroke={fill}
      strokeWidth={1.5}
    />
    <Path
      d="M21 12.5l4.615-1.923A1 1 0 0127 11.5v7.113a1 1 0 01-1.316.948L21 18"
      stroke={fill}
      strokeWidth={1.5}
    />
  </Svg>
);
