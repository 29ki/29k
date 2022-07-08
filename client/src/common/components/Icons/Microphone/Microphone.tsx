import React from 'react';
import {StyleSheet} from 'react-native';
import Svg, {Path, Rect} from 'react-native-svg';
import {COLORS} from '../../../constants/colors';

const style = StyleSheet.create({icon: {aspectRatio: 1}});

export const MicrophoneIcon = ({fill = COLORS.GREY200}) => (
  <Svg width="100%" height="100%" viewBox="0 0 30 30" style={style.icon}>
    <Rect
      x={11.75}
      y={4.75}
      width={6.5}
      height={13.5}
      rx={3.25}
      stroke={fill}
      strokeWidth={1.5}
    />
    <Path
      d="M15 26v-3.667M8 15v.333a7 7 0 007 7v0a7 7 0 007-7V15"
      stroke={fill}
      strokeWidth={1.5}
      strokeLinecap="round"
    />
  </Svg>
);
