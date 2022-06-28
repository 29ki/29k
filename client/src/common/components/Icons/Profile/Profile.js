import React from 'react';
import {StyleSheet} from 'react-native';
import Svg, {Circle, Path} from 'react-native-svg';
import {COLORS} from '../../../constants/colors';

const styles = StyleSheet.create({
  profile: {
    aspectRatio: 1,
  },
});

export const ProfileIcon = ({fill = COLORS.GREY100}) => (
  <Svg width="100%" height="100%" viewBox="0 0 30 30" style={styles.profile}>
    <Circle cx={15} cy={10} r={3.75} stroke={fill} strokeWidth={1.5} />
    <Path
      d="M7.26 23.877a.75.75 0 00.74.873h14a.75.75 0 00.74-.873l-.014-.082a7.833 7.833 0 00-15.452 0l-.014.082z"
      stroke={fill}
      strokeWidth={1.5}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </Svg>
);
